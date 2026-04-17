from sqlalchemy import create_engine, Column, Float, String, Integer
from sqlalchemy.orm import declarative_base, sessionmaker
import os

os.makedirs("data", exist_ok=True)

DATABASE_URL = "sqlite:///./data/gridcast.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

class StockPrice(Base):
    __tablename__ = "stock_prices"
    id     = Column(Integer, primary_key=True, index=True)
    date   = Column(String)
    ticker = Column(String)
    open   = Column(Float)
    high   = Column(Float)
    low    = Column(Float)
    close  = Column(Float)
    volume = Column(Float)

class TemperatureRecord(Base):
    __tablename__ = "temperature_records"
    id           = Column(Integer, primary_key=True, index=True)
    date         = Column(String)
    t_max        = Column(Float)
    t_min        = Column(Float)
    humidity     = Column(Float)
    heatwave_day = Column(Integer)
    departure    = Column(Float)

class Prediction(Base):
    __tablename__ = "predictions"
    id              = Column(Integer, primary_key=True, index=True)
    date            = Column(String)
    ticker          = Column(String)
    predicted_price = Column(Float)
    actual_price    = Column(Float)

class ModelMetadata(Base):
    __tablename__ = "model_metadata"
    id         = Column(Integer, primary_key=True, index=True)
    ticker     = Column(String)
    rmse       = Column(Float)
    r2         = Column(Float)
    trained_on = Column(String)

class StockFundamental(Base):
    __tablename__ = "stock_fundamentals"
    id             = Column(Integer, primary_key=True, index=True)
    date           = Column(String)
    ticker         = Column(String)
    daily_return   = Column(Float)
    volatility_5d  = Column(Float)
    volatility_20d = Column(Float)

class MacroIndicator(Base):
    __tablename__ = "macro_indicators"
    id           = Column(Integer, primary_key=True, index=True)
    date         = Column(String)
    usd_inr_rate = Column(Float)

class StockValuation(Base):
    __tablename__ = "stock_valuations"
    id       = Column(Integer, primary_key=True, index=True)
    date     = Column(String)
    ticker   = Column(String)
    pe_ratio = Column(Float)
    eps      = Column(Float)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
