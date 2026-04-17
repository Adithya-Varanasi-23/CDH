import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from database import SessionLocal, StockPrice, TemperatureRecord

TICKERS = {
    "NTPC": "NTPC.NS",
    "ADANIPOWER": "ADANIPOWER.NS",
    "TATAPOWER": "TATAPOWER.NS",
    "JSWENERGY": "JSWENERGY.NS",
    "POWERGRID": "POWERGRID.NS"
}

def fetch_and_store_stocks(days=365):
    db = SessionLocal()
    end = datetime.today()
    start = end - timedelta(days=days)
    print("Fetching stock data...")
    for name, symbol in TICKERS.items():
        try:
            df = yf.download(symbol, start=start, end=end, progress=False)
            if df.empty:
                print(f"No data for {name}")
                continue
            df = df.reset_index()
            df.columns = [col[0] if isinstance(col, tuple) else col for col in df.columns]
            for _, row in df.iterrows():
                date_val = row["Date"]
                if hasattr(date_val, 'date'):
                    date_str = str(date_val.date())
                else:
                    date_str = str(pd.Timestamp(date_val).date())
                record = StockPrice(
                    date=date_str,
                    ticker=name,
                    open=float(row["Open"]),
                    high=float(row["High"]),
                    low=float(row["Low"]),
                    close=float(row["Close"]),
                    volume=float(row["Volume"])
                )
                db.add(record)
            db.commit()
            print(f"Stored {len(df)} records for {name}")
        except Exception as e:
            print(f"Error fetching {name}: {e}")
    db.close()

def generate_and_store_temperature(days=365):
    db = SessionLocal()
    print("Generating temperature data...")
    end = datetime.today()
    base = end - timedelta(days=days)
    dates = [base + timedelta(days=i) for i in range(days)]
    for d in dates:
        month = d.month
        if month in [4, 5, 6]:
            t_max = round(np.random.uniform(36, 46), 1)
            t_min = round(np.random.uniform(26, 34), 1)
        elif month in [7, 8, 9]:
            t_max = round(np.random.uniform(30, 38), 1)
            t_min = round(np.random.uniform(24, 30), 1)
        elif month in [12, 1, 2]:
            t_max = round(np.random.uniform(18, 28), 1)
            t_min = round(np.random.uniform(10, 18), 1)
        else:
            t_max = round(np.random.uniform(28, 38), 1)
            t_min = round(np.random.uniform(18, 26), 1)
        normal = 30.0
        departure = round(t_max - normal, 1)
        heatwave = 1 if t_max >= 37 else 0
        humidity = round(np.random.uniform(30, 85), 1)
        record = TemperatureRecord(
            date=str(d.date()),
            t_max=t_max,
            t_min=t_min,
            humidity=humidity,
            heatwave_day=heatwave,
            departure=departure
        )
        db.add(record)
    db.commit()
    print(f"Stored {days} temperature records")
    db.close()

if __name__ == "__main__":
    fetch_and_store_stocks(days=365)
    print("Data pipeline complete!")
