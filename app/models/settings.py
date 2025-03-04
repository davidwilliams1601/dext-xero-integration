from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from app.core.security import api_key_encryption

Base = declarative_base()

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    
    # Encrypted fields
    _dext_api_key = Column('dext_api_key', String, nullable=True)
    _xero_client_id = Column('xero_client_id', String, nullable=True)
    _xero_client_secret = Column('xero_client_secret', String, nullable=True)
    _xero_access_token = Column('xero_access_token', String, nullable=True)
    _xero_refresh_token = Column('xero_refresh_token', String, nullable=True)
    _openai_api_key = Column('openai_api_key', String, nullable=True)
    
    # Non-encrypted fields
    xero_token_expires_at = Column(String, nullable=True)
    google_cloud_vision_credentials = Column(JSON, nullable=True)

    @property
    def dext_api_key(self):
        if self._dext_api_key:
            return api_key_encryption.decrypt(self._dext_api_key)
        return None

    @dext_api_key.setter
    def dext_api_key(self, value):
        if value:
            self._dext_api_key = api_key_encryption.encrypt(value)
        else:
            self._dext_api_key = None

    @property
    def xero_client_id(self):
        if self._xero_client_id:
            return api_key_encryption.decrypt(self._xero_client_id)
        return None

    @xero_client_id.setter
    def xero_client_id(self, value):
        if value:
            self._xero_client_id = api_key_encryption.encrypt(value)
        else:
            self._xero_client_id = None

    @property
    def xero_client_secret(self):
        if self._xero_client_secret:
            return api_key_encryption.decrypt(self._xero_client_secret)
        return None

    @xero_client_secret.setter
    def xero_client_secret(self, value):
        if value:
            self._xero_client_secret = api_key_encryption.encrypt(value)
        else:
            self._xero_client_secret = None

    @property
    def xero_access_token(self):
        if self._xero_access_token:
            return api_key_encryption.decrypt(self._xero_access_token)
        return None

    @xero_access_token.setter
    def xero_access_token(self, value):
        if value:
            self._xero_access_token = api_key_encryption.encrypt(value)
        else:
            self._xero_access_token = None

    @property
    def xero_refresh_token(self):
        if self._xero_refresh_token:
            return api_key_encryption.decrypt(self._xero_refresh_token)
        return None

    @xero_refresh_token.setter
    def xero_refresh_token(self, value):
        if value:
            self._xero_refresh_token = api_key_encryption.encrypt(value)
        else:
            self._xero_refresh_token = None

    @property
    def openai_api_key(self):
        if self._openai_api_key:
            return api_key_encryption.decrypt(self._openai_api_key)
        return None

    @openai_api_key.setter
    def openai_api_key(self, value):
        if value:
            self._openai_api_key = api_key_encryption.encrypt(value)
        else:
            self._openai_api_key = None 