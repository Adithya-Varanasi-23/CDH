import torch
import torch.nn as nn
import numpy as np
import pandas as pd
import pickle
import os
from torch.utils.data import DataLoader, TensorDataset
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from database import SessionLocal, StockPrice, TemperatureRecord, ModelMetadata, StockFundamental, MacroIndicator
from datetime import datetime

os.makedirs("model", exist_ok=True)

TICKERS   = ["NTPC", "ADANIPOWER", "TATAPOWER", "JSWENERGY", "POWERGRID"]
WINDOW    = 60
EPOCHS    = 100
PATIENCE  = 15
BATCH     = 32
LR        = 0.001

class LSTMModel(nn.Module):
    def __init__(self, input_size=16):
        super(LSTMModel, self).__init__()
        self.lstm1   = nn.LSTM(input_size=input_size, hidden_size=100, batch_first=True)
        self.dropout = nn.Dropout(0.2)
        self.lstm2   = nn.LSTM(input_size=100, hidden_size=50, batch_first=True)
        self.fc      = nn.Linear(50, 1)

    def forward(self, x):
        out, _      = self.lstm1(x)
        out         = self.dropout(out)
        out, _      = self.lstm2(out)
        out         = out[:, -1, :]
        out         = self.fc(out)
        return out

def get_stock_df(db, ticker):
    records = db.query(StockPrice).filter(
        StockPrice.ticker == ticker
    ).order_by(StockPrice.date).all()
    return pd.DataFrame([{
        "date": r.date, "open": r.open, "high": r.high,
        "low": r.low, "close": r.close, "volume": r.volume
    } for r in records])

def get_temp_df(db):
    records = db.query(TemperatureRecord).order_by(
        TemperatureRecord.date
    ).all()
    return pd.DataFrame([{
        "date": r.date, "t_max": r.t_max, "t_min": r.t_min,
        "humidity": r.humidity, "heatwave_day": r.heatwave_day,
        "departure": r.departure
    } for r in records])

def get_fund_df(db, ticker):
    records = db.query(StockFundamental).filter(
        StockFundamental.ticker == ticker
    ).order_by(StockFundamental.date).all()
    if not records:
        return pd.DataFrame(columns=["date", "daily_return", "volatility_5d", "volatility_20d"])
    return pd.DataFrame([{
        "date": r.date, "daily_return": r.daily_return,
        "volatility_5d": r.volatility_5d, "volatility_20d": r.volatility_20d
    } for r in records])

def get_macro_df(db):
    records = db.query(MacroIndicator).order_by(MacroIndicator.date).all()
    if not records:
        return pd.DataFrame(columns=["date", "usd_inr_rate"])
    return pd.DataFrame([{
        "date": r.date, "usd_inr_rate": r.usd_inr_rate
    } for r in records])

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

def build_sequences(X, y, window=60):
    Xs, ys = [], []
    for i in range(window, len(X)):
        Xs.append(X[i-window:i])
        ys.append(y[i])
    return np.array(Xs, dtype=np.float32), np.array(ys, dtype=np.float32)

def train_ticker(ticker, db):
    print(f"\n{'='*50}")
    print(f"Training LSTM for {ticker}")
    print(f"{'='*50}")

    stock_df = get_stock_df(db, ticker)
    temp_df  = get_temp_df(db)
    df       = pd.merge(stock_df, temp_df, on="date", how="inner")
    
    fund_df  = get_fund_df(db, ticker)
    if not fund_df.empty:
        df = pd.merge(df, fund_df, on="date", how="left")
    else:
        df["volatility_5d"] = 0
        df["volatility_20d"] = 0
        df["daily_return"] = 0
        
    macro_df = get_macro_df(db)
    if not macro_df.empty:
        df = pd.merge(df, macro_df, on="date", how="left")
    else:
        df["usd_inr_rate"] = 0
        
    df       = add_features(df)
    df.fillna(0, inplace=True)
    df.reset_index(drop=True, inplace=True)

    FEATURES = [
        "open", "high", "low", "close", "volume",
        "t_max", "t_min", "humidity", "heatwave_day", "departure",
        "ma_5", "ma_20", "lag_return_1", "lag_return_2",
        "rsi_14", "macd", "volatility_5d", "volatility_20d", "usd_inr_rate"
    ]

    X = df[FEATURES].values
    y = df["close"].values

    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()
    X_scaled = scaler_X.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y.reshape(-1, 1)).flatten()

    X_seq, y_seq = build_sequences(X_scaled, y_scaled, WINDOW)

    n          = len(X_seq)
    train_end  = int(n * 0.70)
    val_end    = int(n * 0.85)

    X_train = torch.tensor(X_seq[:train_end])
    y_train = torch.tensor(y_seq[:train_end]).unsqueeze(1)
    X_val   = torch.tensor(X_seq[train_end:val_end])
    y_val   = torch.tensor(y_seq[train_end:val_end]).unsqueeze(1)
    X_test  = torch.tensor(X_seq[val_end:])
    y_test  = torch.tensor(y_seq[val_end:]).unsqueeze(1)

    print(f"  Train: {len(X_train)} | Val: {len(X_val)} | Test: {len(X_test)}")

    train_loader = DataLoader(
        TensorDataset(X_train, y_train),
        batch_size=BATCH, shuffle=False
    )

    model     = LSTMModel(input_size=len(FEATURES))
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LR)

    best_val_loss  = float("inf")
    patience_count = 0
    best_weights   = None

    print(f"\n  Epoch    Train Loss    Val Loss")
    print(f"  {'-'*35}")

    for epoch in range(1, EPOCHS + 1):
        model.train()
        train_loss = 0
        for xb, yb in train_loader:
            optimizer.zero_grad()
            pred = model(xb)
            loss = criterion(pred, yb)
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
        train_loss /= len(train_loader)

        model.eval()
        with torch.no_grad():
            val_pred = model(X_val)
            val_loss = criterion(val_pred, y_val).item()

        if epoch % 10 == 0 or epoch == 1:
            print(f"  {epoch:>5}    {train_loss:.6f}    {val_loss:.6f}")

        if val_loss < best_val_loss:
            best_val_loss  = val_loss
            patience_count = 0
            best_weights   = {k: v.clone() for k, v in model.state_dict().items()}
        else:
            patience_count += 1
            if patience_count >= PATIENCE:
                print(f"\n  Early stopping at epoch {epoch}")
                break

    model.load_state_dict(best_weights)

    model.eval()
    with torch.no_grad():
        y_pred_scaled = model(X_test).numpy().flatten()
        y_test_np     = y_test.numpy().flatten()

    y_pred   = scaler_y.inverse_transform(y_pred_scaled.reshape(-1, 1)).flatten()
    y_actual = scaler_y.inverse_transform(y_test_np.reshape(-1, 1)).flatten()

    rmse = np.sqrt(mean_squared_error(y_actual, y_pred))
    mae  = mean_absolute_error(y_actual, y_pred)
    r2   = r2_score(y_actual, y_pred)
    mape = np.mean(np.abs((y_actual - y_pred) / y_actual)) * 100
    acc  = max(0, 100 - mape)

    print(f"\n  Results on Test Set:")
    print(f"  RMSE     : {rmse:.2f}")
    print(f"  MAE      : {mae:.2f}")
    print(f"  MAPE     : {mape:.2f}%")
    print(f"  R2 Score : {r2:.4f}")
    print(f"  Accuracy : {acc:.1f}%")

    torch.save(model.state_dict(), f"model/lstm_{ticker}.pt")
    with open(f"model/scaler_X_{ticker}.pkl", "wb") as f:
        pickle.dump(scaler_X, f)
    with open(f"model/scaler_y_{ticker}.pkl", "wb") as f:
        pickle.dump(scaler_y, f)
    with open(f"model/features_{ticker}.pkl", "wb") as f:
        pickle.dump(FEATURES, f)

    meta = ModelMetadata(
        ticker=ticker,
        rmse=round(rmse, 2),
        r2=round(r2, 4),
        trained_on=str(datetime.today().date())
    )
    db.add(meta)
    db.commit()
    print(f"  Model saved: model/lstm_{ticker}.pt")

if __name__ == "__main__":
    db = SessionLocal()
    for ticker in TICKERS:
        train_ticker(ticker, db)
    db.close()
    print("\nAll 5 LSTM models trained and saved!")
