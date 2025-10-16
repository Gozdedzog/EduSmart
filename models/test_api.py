#!/usr/bin/env python3
"""
Learning Style Prediction API - Test Script
Bu script, FastAPI servisinin sağlık durumunu, model bilgilerini ve tahmin endpoint'ini test eder.
"""

import requests
import json
from typing import Dict, Any

# ---------------------------------------------------------------------
# Test verisi (örnek giriş)
# ---------------------------------------------------------------------
TEST_DATA = {
    "age": 19,
    "gender": "M",
    "video_answers": [1, 0, 1, 1, 0, 1, 0, 1, 1, 0,
                      1, 0, 1, 1, 0, 1, 0, 1, 1, 0,
                      1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
    "text_answers": [0, 1, 0, 0, 1, 0, 1, 0, 0, 1,
                     0, 1, 0, 0, 1, 0, 1, 0, 0, 1,
                     0, 1, 0, 0, 1, 0, 1, 0, 0, 1]
}

BASE_URL = "http://localhost:8000"

# ---------------------------------------------------------------------
# Yardımcı Fonksiyonlar
# ---------------------------------------------------------------------
def print_json(title: str, data: Dict[str, Any]):
    """Yanıtı biçimli JSON olarak yazdırır."""
    print(f"\n📄 {title}:")
    print(json.dumps(data, indent=2, ensure_ascii=False))

def test_health():
    """Sağlık kontrolü"""
    print("\n🔍 Health Check:")
    response = requests.get(f"{BASE_URL}/health")
    if response.ok:
        print_json("Health Response", response.json())
    else:
        print(f"❌ Hata [{response.status_code}]: {response.text}")

def test_model_info():
    """Model bilgilerini test et"""
    print("\n📊 Model Info:")
    response = requests.get(f"{BASE_URL}/model-info")
    if response.ok:
        print_json("Model Info", response.json())
    else:
        print(f"❌ Hata [{response.status_code}]: {response.text}")

def test_prediction():
    """Tahmin endpoint’ini test et"""
    print("\n🎯 Prediction Test:")
    response = requests.post(f"{BASE_URL}/predict", json=TEST_DATA)
    if response.ok:
        result = response.json()
        print("✅ Tahmin başarılı!")
        print(f"🔹 Tahmin edilen stil: {result['predicted_style']}")
        print(f"🔹 Güven skoru: {result['confidence']:.3f}")
        print(f"🔹 Video Skoru: {result['video_score']}/30 ({result['video_percentage']}%)")
        print(f"🔹 Text Skoru: {result['text_score']}/30 ({result['text_percentage']}%)")
        print_json("🎓 Öneriler", result["recommendation"])
    else:
        print(f"❌ Tahmin başarısız [{response.status_code}]: {response.text}")

# ---------------------------------------------------------------------
# Ana Çalışma Bloğu
# ---------------------------------------------------------------------
def main():
    print("🚀 API Test Başlatılıyor...")
    print(f"🌐 Base URL: {BASE_URL}")
    try:
        test_health()
        test_model_info()
        test_prediction()
        print("\n✅ Tüm testler tamamlandı!")
    except requests.exceptions.ConnectionError:
        print("❌ API'ye bağlanılamadı. Lütfen API'nin çalıştığından emin olun.")
    except Exception as e:
        print(f"❌ Test hatası: {e}")

# ---------------------------------------------------------------------
if __name__ == "__main__":
    main()
