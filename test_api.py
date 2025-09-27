#!/usr/bin/env python3
"""
API Test Script
"""

import requests
import json

# Test verisi
test_data = {
    "age": 19,
    "gender": "M",
    "video_answers": [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
    "text_answers": [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1]
}

def test_api():
    """API'yi test et"""
    base_url = "http://localhost:8000"
    
    try:
        # Health check
        print("🔍 Health check...")
        response = requests.get(f"{base_url}/health")
        print(f"Health: {response.json()}")
        
        # Model info
        print("\n📊 Model info...")
        response = requests.get(f"{base_url}/model-info")
        print(f"Model info: {response.json()}")
        
        # Prediction
        print("\n🎯 Prediction test...")
        response = requests.post(f"{base_url}/predict", json=test_data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Prediction successful!")
            print(f"Predicted style: {result['predicted_style']}")
            print(f"Confidence: {result['confidence']:.3f}")
            print(f"Video score: {result['video_score']}/30")
            print(f"Text score: {result['text_score']}/30")
            print(f"Recommendation: {result['recommendation']}")
        else:
            print(f"❌ Prediction failed: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ API'ye bağlanılamadı. API çalışıyor mu?")
    except Exception as e:
        print(f"❌ Test hatası: {e}")

if __name__ == "__main__":
    test_api()
