import torch
import torch.nn as nn
import numpy as np
import pickle
from database import SessionLocal, StockPrice, TemperatureRecord, Prediction, StockFundamental, MacroIndicator
from datetime import datetime, timedelta
import pandas as pd

TICKERS  = ["NTPC", "ADANIPOWER", "TATAPOWER", "JSWENERGY", "POWERGRID"]
WINDOW   = 60

class LSTMModel(nn.Module):
    def __init__(self, input_size=16):
        super(LSTMModel, self).__init__()
        self.lstm1   = nn.LSTM(input_size=input_size, hidden_size=100, batch_first=True)
        self.dropout = nn.Dropout(0.2)
        self.lstm2   = nn.LSTM(input_size=100, hidden_size=50, batch_first=True)
        self.fc      = nn.Linear(50, 1)

    def forward(self, x):
        out, _ = self.lstm1(x)
        out    = self.dropout(out)
        out, _ = self.lstm2(out)
        out    = out[:, -1, :]
        out    = self.fc(out)
        return out

models   = {}
scalersX = {}
scalersY = {}
features = {}

def load_all_models():
    print("Loading all LSTM models...")
    for ticker in TICKERS:
        with open(f"model/features_{ticker}.pkl", "rb") as f:
            feat = pickle.load(f)
        features[ticker] = feat
        model = LSTMModel(input_size=len(feat))
        model.load_state_dict(
            torch.load(f"model/lstm_{ticker}.pt", map_location="cpu", weights_only=True)
        )
        model.eval()
        models[ticker] = model
        with open(f"model/scaler_X_{ticker}.pkl", "rb") as f:
            scalersX[ticker] = pickle.load(f)
        with open(f"model/scaler_y_{ticker}.pkl", "rb") as f:
            scalersY[ticker] = pickle.load(f)
    print("All models loaded successfully!")

def add_features(df):
    df["ma_5"]         = df["close"].rolling(5).mean()
    df["ma_20"]        = df["close"].rolling(20).mean()
    df["lag_return_1"] = df["close"].pct_change(1)
    df["lag_return_2"] = df["close"].pct_change(2)
    delta              = df["close"].diff()
    gain               = delta.where(delta > 0, 0).rolling(14).mean()
    loss               = (-delta.where(delta < 0, 0)).rolling(14).mean()
    rs                 = gain / loss
    df["rsi_14"]       = 100 - (100 / (1 + rs))
    ema12              = df["close"].ewm(span=12).mean()
    ema26              = df["close"].ewm(span=26).mean()
    df["macd"]         = ema12 - ema26
    return df

def get_latest_data(ticker):
    db = SessionLocal()
    stock_records = db.query(StockPrice).filter(
        StockPrice.ticker == ticker
    ).order_by(StockPrice.date.desc()).limit(WINDOW + 30).all()
    temp_records = db.query(TemperatureRecord).order_by(
        TemperatureRecord.date.desc()
    ).limit(WINDOW + 30).all()
    
    fund_records = db.query(StockFundamental).filter(
        StockFundamental.ticker == ticker
    ).order_by(StockFundamental.date.desc()).limit(WINDOW + 30).all()
    
    macro_records = db.query(MacroIndicator).order_by(
        MacroIndicator.date.desc()
    ).limit(WINDOW + 30).all()
    db.close()

    stock_df = pd.DataFrame([{
        "date": r.date, "open": r.open, "high": r.high,
        "low": r.low, "close": r.close, "volume": r.volume
    } for r in reversed(stock_records)])

    temp_df = pd.DataFrame([{
        "date": r.date, "t_max": r.t_max, "t_min": r.t_min,
        "humidity": r.humidity, "heatwave_day": r.heatwave_day,
        "departure": r.departure
    } for r in reversed(temp_records)])

    df = pd.merge(stock_df, temp_df, on="date", how="inner")
    
    if fund_records:
        fund_df = pd.DataFrame([{
            "date": r.date, "daily_return": r.daily_return,
            "volatility_5d": r.volatility_5d, "volatility_20d": r.volatility_20d
        } for r in reversed(fund_records)])
        df = pd.merge(df, fund_df, on="date", how="left")
    else:
        df["volatility_5d"] = 0
        df["volatility_20d"] = 0
        df["daily_return"] = 0
        
    if macro_records:
        macro_df = pd.DataFrame([{
            "date": r.date, "usd_inr_rate": r.usd_inr_rate
        } for r in reversed(macro_records)])
        df = pd.merge(df, macro_df, on="date", how="left")
    else:
        df["usd_inr_rate"] = 0

    df = add_features(df)
    df.fillna(0, inplace=True)
    return df

def predict_next(ticker):
    df       = get_latest_data(ticker)
    feat     = features[ticker]
    scaler_X = scalersX[ticker]
    scaler_y = scalersY[ticker]
    model    = models[ticker]

    if len(df) < WINDOW:
        return None

    X       = df[feat].values[-WINDOW:]
    X_sc    = scaler_X.transform(X)
    tensor  = torch.tensor(X_sc, dtype=torch.float32).unsqueeze(0)

    with torch.no_grad():
        pred_sc = model(tensor).numpy().flatten()

    pred_price = scaler_y.inverse_transform(
        pred_sc.reshape(-1, 1)
    ).flatten()[0]

    actual_price = float(df["close"].values[-1])
    date_str     = str(datetime.today().date())

    db = SessionLocal()
    record = Prediction(
        date=date_str,
        ticker=ticker,
        predicted_price=round(float(pred_price), 2),
        actual_price=round(actual_price, 2)
    )
    db.add(record)
    db.commit()
    db.close()

    return {
        "ticker":          ticker,
        "date":            date_str,
        "predicted_price": round(float(pred_price), 2),
        "actual_price":    round(actual_price, 2),
        "change_pct":      round(((float(pred_price) - actual_price) / actual_price) * 100, 2)
    }

def predict_all():
    results = {}
    for ticker in TICKERS:
        result = predict_next(ticker)
        if result:
            results[ticker] = result
            print(f"{ticker}: Predicted ₹{result['predicted_price']} | Actual ₹{result['actual_price']} | Change {result['change_pct']}%")
    return results

if __name__ == "__main__":
    load_all_models()
    print("\nRunning predictions for all stocks...")
    predict_all()
