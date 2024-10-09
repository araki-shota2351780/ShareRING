import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { FaCamera, FaBars, FaGlobe, FaUsers, FaCloudSun, FaCompass } from 'react-icons/fa';
import './App.css';
import './Auth.css';
import LoginUI from './LoginUI';
import SignUpUI from './SignUpUI';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const defaultCenter = {
  lat: 35.682839, //マップの初期値、東京
  lng: 139.759455,
};

// メイン画面
const MainScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(defaultCenter); // 現在地の初期値
  const [locationLoaded, setLocationLoaded] = useState(false); // 現在地がロードされたかのフラグ
  const [compassHeading, setCompassHeading] = useState(0); // コンパスの方向
  const [markers, setMarkers] = useState([]); // マーカーの管理
  const [isCameraOpen, setIsCameraOpen] = useState(false); // カメラの状態管理
  const [isMenuOpen, setIsMenuOpen] = useState(false); // メニューの状態管理
  const [isEveryonePostsVisible, setIsEveryonePostsVisible] = useState(false); // みんなの投稿
  const [isGroupPostsVisible, setIsGroupPostsVisible] = useState(false); // グループの投稿
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false); // ファイルアップロードの状態管理
  const [weatherInfo, setWeatherInfo] = useState(null); // 天気情報
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Google Maps APIを同期的にロードする
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCIbW8SaZBjgKXB3yt7ig0OYnzD0TIi2h8', // APIキー
    libraries: ['places'],
  });

  // 現在地の取得
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude }); // 現在地を設定
            setLocationLoaded(true); // 現在地の取得フラグ
          },
          (error) => {
            console.error('現在地の取得に失敗しました:', error.message);
            alert('現在地を取得できませんでした。デフォルト位置（東京）を使用します。');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        alert('このブラウザはGeolocation APIに対応していません。');
      }
    };

    if (isLoaded && window.google) {
      getLocation(); // Google Maps APIがロードされた後に現在地を取得
    }
  }, [isLoaded]);

  // カメラ起動
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error('カメラにアクセスできません: ', err);
      alert('カメラにアクセスできません。ファイルをアップロードしてください。');
      setIsCameraOpen(false);
    }
  };

  // カメラで撮影して写真をマップに表示
  const capturePhoto = (lat, lng) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photo = canvas.toDataURL('image/png');
    const newMarker = { lat, lng, photo };
    setMarkers((current) => [...current, newMarker]);

    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    setIsCameraOpen(false);
  };

  // ファイルアップロードによるマーカー追加
  const handleFileUpload = (event, lat, lng) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const newMarker = { lat, lng, photo: reader.result };
      setMarkers((current) => [...current, newMarker]);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleEveryonePosts = () => {
    setIsEveryonePostsVisible(!isEveryonePostsVisible);
  };

  const toggleGroupPosts = () => {
    setIsGroupPostsVisible(!isGroupPostsVisible);
  };

  // 天気情報取得機能
  const toggleWeatherInfo = async () => {
    if (weatherInfo) {
      setWeatherInfo(null);
    } else {
      const apiKey = 'f4086c10fc0c216397a70b5755900c63'; // OpenWeatherMapのAPIキー
      const { lat, lng } = currentLocation;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=ja`
        );
        const data = await response.json();

        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        const location = data.name;

        setWeatherInfo({
          location,
          temperature: `${temperature}°C`,
          condition: weatherDescription,
        });
      } catch (error) {
        console.error('天気情報の取得に失敗しました: ', error);
      }
    }
  };

  if (!isLoaded) return <div>Loading Maps...</div>; // APIが読み込まれるまで待機

  return (
    <div className="app">
      {isLoaded && window.google && locationLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={currentLocation}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={{
                url: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          ))}
        </GoogleMap>
      )}

      <div className="camera-button" onClick={startCamera}>
        <FaCamera size={40} color="#fff" />
      </div>

      <div className="menu-button" onClick={toggleMenu}>
        <FaBars size={30} color="#fff" />
      </div>

      {isMenuOpen && (
        <div className="menu">
          <ul>
            <li onClick={() => alert('マイページ')}>マイページ</li>
            <li onClick={() => alert('機能紹介')}>機能紹介</li>
            <li onClick={() => alert('AI検索')}>AI検索</li>
            <li onClick={() => alert('マイリスト')}>マイリスト</li>
            <li onClick={() => alert('アチーブメント')}>アチーブメント</li>
          </ul>
        </div>
      )}

      <div className="everyone-posts-button" onClick={toggleEveryonePosts}>
        <FaGlobe size={30} color="#fff" />
      </div>

      <div className="group-posts-button" onClick={toggleGroupPosts}>
        <FaUsers size={30} color="#fff" />
      </div>

      <div className="weather-button" onClick={toggleWeatherInfo}>
        <FaCloudSun size={30} color="#fff" />
      </div>

      <div className="compass-button" style={{ transform: `rotate(${compassHeading}deg)` }}>
        <FaCompass size={30} color="#fff" />
      </div>

      {weatherInfo && (
        <div className="weather-info">
          <h3>天気情報</h3>
          <p>場所: {weatherInfo.location}</p>
          <p>気温: {weatherInfo.temperature}</p>
          <p>天気: {weatherInfo.condition}</p>
        </div>
      )}

      {isCameraOpen && (
        <div className="camera">
          <video ref={videoRef} width="100%" height="auto"></video>
          <button onClick={() => capturePhoto(currentLocation.lat, currentLocation.lng)}>写真を撮る</button>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
      )}

      {isFileUploadOpen && (
        <div className="file-upload">
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, currentLocation.lat, currentLocation.lng)} />
        </div>
      )}
    </div>
  );
};

// ログイン画面
const LoginScreen = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/main');
  };

  return <LoginUI onLogin={handleLogin} />;
};

// アカウント作成画面
const SignUpScreen = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/main');
  };

  return <SignUpUI onSignUp={handleSignUp} />;
};

// アプリ全体のルーティング設定
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/main" element={<MainScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
