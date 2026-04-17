import os
import requests
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
import numpy as np
import time
from dotenv import load_dotenv

from database import SessionLocal, StockFundamental, MacroIndicator, StockValuation
from data_pipeline import fetch_and_store_stocks, generate_and_store_temperature, TICKERS

load_dotenv(".env.local")

ALPHA_VANTAGE_API_KEY = os.environ.get("ALPHA_VANTAGE_API_KEY")

def fetch_fundamentals(days=365):
    if not ALPHA_VANTAGE_API_KEY:
        print("No Alpha Vantage API key found, skipping fundamentals")
        return
    db = SessionLocal()
    end_date = datetime.today()
    start_date = end_date - timedelta(days=days)
    
    print("Fetching Alpha Vantage fundamentals...")
    for name, symbol in TICKERS.items():
        try:
            # Alpha Vantage uses .BSE for Indian stocks on the BSE exchange. 
            # We use the ticker name (e.g. NTPC.BSE)
            av_symbol = name + ".BSE"
            url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={av_symbol}&outputsize=full&apikey={ALPHA_VANTAGE_API_KEY}"
            resp = requests.get(url).json()
            
            if "Time Series (Daily)" not in resp:
                print(f"Alpha Vantage limit reached or no data for {name}. Response: {resp.get('Information', resp)}")
                continue
                
            ts = resp["Time Series (Daily)"]
            df = pd.DataFrame.from_dict(ts, orient='index')
            df.index = pd.to_datetime(df.index)
            df['4. close'] = df['4. close'].astype(float)
            df = df.sort_index()
            
            # calculate returns and volatility
            df['daily_return'] = df['4. close'].pct_change()
            df['volatility_5d'] = df['daily_return'].rolling(5).std()
            df['volatility_20d'] = df['daily_return'].rolling(20).std()
            
            df = df.dropna()
            df = df[df.index >= pd.to_datetime(start_date.date())]
            
            count = 0
            for date_idx, row in df.iterrows():
                date_str = str(date_idx.date())
                
                # We could check if it exists, but for simplicity we insert. In a real prod environment we'd use UPSERT.
                record = StockFundamental(
                    date=date_str,
                    ticker=name,
                    daily_return=float(row['daily_return']),
                    volatility_5d=float(row['volatility_5d']),
                    volatility_20d=float(row['volatility_20d'])
                )
                db.add(record)
                count += 1
            db.commit()
            print(f"Stored {count} fundamentals for {name}")
            
            # Sleep to respect rate limits (5 API requests per minute for standard free tier)
            time.sleep(12) 
        except Exception as e:
            print(f"Error fetching fundamentals for {name}: {e}")
    db.close()

def fetch_macro(days=365):
    print("Fetching Macro Indicators from Yahoo Finance...")
    db = SessionLocal()
    end_date = datetime.today()
    start_date = end_date - timedelta(days=days)
    try:
        df = yf.download("INR=X", start=start_date, end=end_date, progress=False)
        # Handle MultiIndex columns for yfinance >= 0.2.x
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [col[0] for col in df.columns]
        
        df = df.reset_index()
        count = 0
        for _, row in df.iterrows():
            if pd.isna(row['Close']): continue
            date_val = row["Date"]
            date_str = str(date_val.date()) if hasattr(date_val, 'date') else str(pd.Timestamp(date_val).date())
            record = MacroIndicator(
                date=date_str,
                usd_inr_rate=float(row['Close'])
            )
            db.add(record)
            count += 1
        db.commit()
        print(f"Stored {count} Macro Indicator records")
    except Exception as e:
        print(f"Error fetching macro: {e}")
    db.close()

def fetch_valuations():
    print("Fetching Stock Valuations from Yahoo Finance...")
    db = SessionLocal()
    date_str = str(datetime.today().date())
    for name, symbol in TICKERS.items():
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            pe = info.get('trailingPE', 0.0)
            eps = info.get('trailingEps', 0.0)
            if pe is None: pe = 0.0
            if eps is None: eps = 0.0
            
            record = StockValuation(
                date=date_str,
                ticker=name,
                pe_ratio=float(pe),
                eps=float(eps)
            )
            db.add(record)
            db.commit()
            print(f"Stored valuation for {name} (PE: {pe}, EPS: {eps})")
        except Exception as e:
            print(f"Error fetching valuation for {name}: {e}")
    db.close()

def main():
    print("Starting extended data pipeline...")
    # 1. Existing stock pipeline
    try:
        fetch_and_store_stocks(days=365)
    except Exception as e:
        print(f"Stock fetch failed: {e}")
        
    # 2. Existing climate pipeline mock
    try:
        generate_and_store_temperature(days=365)
    except Exception as e:
        print(f"Temperature gen failed: {e}")
        
    # 3. New fetches
    fetch_fundamentals(days=365)
    fetch_macro(days=365)
    fetch_valuations()
    
    print("Extended data pipeline complete!")

if __name__ == "__main__":
    main()
