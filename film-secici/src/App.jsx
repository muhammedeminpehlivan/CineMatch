import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [aktifSayfa, setAktifSayfa] = useState('anasayfa'); 
  
  // VİTRİN VE KAYDIRMA HAFIZASI (YENİ)
  const [vitrinFilmi, setVitrinFilmi] = useState(null);
  const [sayfaAsagida, setSayfaAsagida] = useState(false);

  const [populerFilmler, setPopulerFilmler] = useState([]);
  const [onerilenFilmler, setOnerilenFilmler] = useState([]);

  const [secilenTur, setSecilenTur] = useState(''); 
  const [secilenPuan, setSecilenPuan] = useState(''); 
  const [secilenSure, setSecilenSure] = useState(''); 
  const [secilenDil, setSecilenDil] = useState(''); 
  
  const [film, setFilm] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  // CINETINDER (MATCH) MODU İÇİN YENİ STATELER
  const [tinderFilmleri, setTinderFilmleri] = useState([]);
  const [izlemeListesi, setIzlemeListesi] = useState([]);
  const [tinderSayfa, setTinderSayfa] = useState(1);
  const [kartAnimasyonu, setKartAnimasyonu] = useState(''); 

  const API_KEY = "792eb25dd5253da2d6dda0943af74299"; 

  // CINETINDER İÇİN FİLM GETİRİCİ
  const tinderFilmleriGetir = async (sayfaNumarasi = 1) => {
    setYukleniyor(true);
    try {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=tr-TR&sort_by=popularity.desc&page=${sayfaNumarasi}`;
      const cevap = await fetch(url);
      const veri = await cevap.json();
      setTinderFilmleri(veri.results);
      setTinderSayfa(sayfaNumarasi);
    } catch (hata) {
      console.error(hata);
    }
    setYukleniyor(false);
  };

  // KARTI SAĞA (EŞLEŞ) VEYA SOLA (GEÇ) KAYDIRMA İŞLEMİ
  const tinderIslem = (islem, secilenFilm) => {
    if (islem === 'match') {
      setKartAnimasyonu('kaydir-sag'); 
      if (!izlemeListesi.find(f => f.id === secilenFilm.id)) {
        setIzlemeListesi([...izlemeListesi, secilenFilm]);
      }
    } else {
      setKartAnimasyonu('kaydir-sol'); 
    }

    setTimeout(() => {
      const yeniListe = tinderFilmleri.slice(1); 
      
      if (yeniListe.length === 0) {
        tinderFilmleriGetir(tinderSayfa + 1);
      } else {
        setTinderFilmleri(yeniListe);
      }
      setKartAnimasyonu(''); 
    }, 300);
  };

  // OYUN İÇİN SEÇTİĞİMİZ EFSANE KELİMELER 🎲
  const sihirliKelimeler = [
    "Uzay", "İntikam", "Yapay Zeka", "Karanlık", "Zaman Yolculuğu", 
    "Sır", "Büyü", "Kıyamet", "Rüya", "Paralel Evren", 
    "Hapishane", "Casus", "Zombi", "Vampir", "Korsan", 
    "Samuray", "Hayatta Kalma", "Dinozor", "Seri Katil", "Hazine", 
    "Okyanus", "Robot", "Gladyatör", "Uzaylı", "Klon", 
    "Hayalet", "Lanet", "Siberpunk", "Deney", "Savaş",
    "Ajan", "Banka Soygunu", "Kayıp", "Adalet", "İhanet", 
    "Kıyamet Sonrası", "Mafya", "Dedektif", "Müzik", "Dans", 
    "Aşk Üçgeni", "Yolculuk", "Sihirbaz", "Ejderha", "Mitoloji", 
    "Şövalye", "Karanlık Madde", "Virüs", "Salgın", "Uzay Gemisi", 
    "Hafıza Kaybı", "Rehine", "Suikast", "Yarış", "Uçak Kazası", 
    "Issız Ada", "Kayıp Şehir", "Atlantis", "Uzaylı İstilası", "Karabasan", 
    "Ruh", "Şeytan Çıkarma", "Orman", "Denizaltı", "Savaş Pilotu", 
    "Keskin Nişancı", "Yeraltı Dünyası", "Kartel", "Kumar", "Dolandırıcı", 
    "Zeka Oyunu", "Dahi", "Kamp", "Mezuniyet", "Düğün", 
    "Paranormal", "Ufo", "Paradoks", "Sonsuzluk", "Kader", 
    "Kehanet", "Nükleer", "Buzul Çağı", "Çöl", "Ninja", 
    "Dövüş Sanatları", "Boks", "Motor Çetesi", "Gizli Tarikat", "Kült", 
    "Tapınak", "Gizemli Kutu", "Zaman Makinesi", "Genetik Mutasyon", "Süper Güç", 
    "Kahraman", "Kötü Adam", "Kaçış Planı", "Kumpas", "Masumiyet", 
    "İnfaz", "Perili Ev", "Terk Edilmiş Hastane", "Uzay İstasyonu", "Kara Delik", 
    "Mars", "Yapay Gerçeklik", "Simülasyon", "Matris", "Hacker",
    "Siber Saldırı", "Kıyamet Günü", "Ölümsüzlük", "Sır Küpü", "Yeraltı Canavarı"
  ];

  useEffect(() => {
    const anaSayfaVerileriniGetir = async () => {
      try {
        const popCevap = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR&page=1`);
        const popVeri = await popCevap.json();
        setPopulerFilmler(popVeri.results);

        if (popVeri.results.length > 0) {
          const rastgeleIndex = Math.floor(Math.random() * 10);
          setVitrinFilmi(popVeri.results[rastgeleIndex]);
        }

        const oneriCevap = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=tr-TR&page=1`);
        const oneriVeri = await oneriCevap.json();
        setOnerilenFilmler(oneriVeri.results);
      } catch (hata) {
        console.error("Ana sayfa verileri çekilemedi", hata);
      }
    };
    anaSayfaVerileriniGetir();

    const scrollDinle = () => {
      if (window.scrollY > 50) {
        setSayfaAsagida(true); 
      } else {
        setSayfaAsagida(false); 
      }
    };

    window.addEventListener('scroll', scrollDinle);
    return () => window.removeEventListener('scroll', scrollDinle);
  }, []);

  const detayGetir = async (filmId) => {
    setYukleniyor(true);
    try {
      const detayUrl = `https://api.themoviedb.org/3/movie/${filmId}?api_key=${API_KEY}&language=tr-TR&append_to_response=credits,videos&include_video_language=tr,en`;
      const detayCevap = await fetch(detayUrl);
      const detayliFilm = await detayCevap.json();
      
      setFilm(detayliFilm);
      setAktifSayfa('detay'); 
    } catch (hata) {
      console.error("Detay hatası:", hata);
    }
    setYukleniyor(false);
  };

  const filmiBul = async () => { 
    setYukleniyor(true);
    try {
      let temelUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=tr-TR&sort_by=popularity.desc`;
      if (secilenTur !== '') temelUrl += `&with_genres=${secilenTur}&without_genres=16`;
      else temelUrl += `&without_genres=16`;
      
      if (secilenPuan !== '') temelUrl += `&vote_average.gte=${secilenPuan}`;
      
      if (secilenSure === 'kisa') temelUrl += `&with_runtime.lte=90`; 
      else if (secilenSure === 'normal') temelUrl += `&with_runtime.gte=90&with_runtime.lte=140`; 
      else if (secilenSure === 'uzun') temelUrl += `&with_runtime.gte=140`; 
      
      if (secilenDil === 'tr') temelUrl += `&with_original_language=tr`; 
      else if (secilenDil === 'en') temelUrl += `&with_original_language=en`; 

      const kesifCevap = await fetch(`${temelUrl}&page=1`);
      const kesifVeri = await kesifCevap.json();

      if (kesifVeri.results && kesifVeri.results.length > 0) {
        const maksSayfa = kesifVeri.total_pages > 20 ? 20 : kesifVeri.total_pages;
        const rastgeleSayfa = Math.floor(Math.random() * maksSayfa) + 1;
        const gercekCevap = await fetch(`${temelUrl}&page=${rastgeleSayfa}`);
        const gercekVeri = await gercekCevap.json();
        const secilenFilmBasit = gercekVeri.results[Math.floor(Math.random() * gercekVeri.results.length)];
        detayGetir(secilenFilmBasit.id);
      } else {
        alert("Bu kriterlere uygun film bulamadık! 😅");
        setYukleniyor(false);
      }
    } catch (hata) { setYukleniyor(false); }
  };

  const kelimeIleFilmBul = async (kelime) => {
    setYukleniyor(true);
    try {
      const aramaUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=tr-TR&query=${kelime}&page=1`;
      const aramaCevap = await fetch(aramaUrl);
      const aramaVeri = await aramaCevap.json();
      if (aramaVeri.results && aramaVeri.results.length > 0) {
        const rastgeleFilm = aramaVeri.results[Math.floor(Math.random() * aramaVeri.results.length)];
        detayGetir(rastgeleFilm.id); 
      } else {
        alert(`Tüh! "${kelime}" ile ilgili bir film bulamadık.`);
      }
    } catch (hata) {}
    setYukleniyor(false);
  };

  const sayfaDegistir = (sayfa) => {
    setFilm(null); 
    setAktifSayfa(sayfa);
    window.scrollTo(0, 0); 
  };

  const fragman = film?.videos?.results?.find(vid => vid.site === "YouTube" && vid.type === "Trailer");

  const sayfaArkaplani = film?.backdrop_path && aktifSayfa === 'detay'
    ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url(https://image.tmdb.org/t/p/original${film.backdrop_path})` }
    : { background: '#0f172a' };

  return (
    <div className="site-govdesi" style={sayfaArkaplani}>
      
      {/* YENİ: AKILLI MENÜ */}
      <nav className={`navbar ${sayfaAsagida ? 'navbar-koyu' : 'navbar-seffaf'}`}>
        <div className="logo" onClick={() => sayfaDegistir('anasayfa')}>
          <span className="logo-ikon">▶</span>
          <span className="logo-cine">Cine</span>
          <span className="logo-match">Match</span>
        </div>

        <div className="menu-linkleri">
          <button className={aktifSayfa === 'anasayfa' ? 'aktif' : ''} onClick={() => sayfaDegistir('anasayfa')}>Ana Sayfa</button>
          <button className={aktifSayfa === 'neizlesek' ? 'aktif' : ''} onClick={() => sayfaDegistir('neizlesek')}>Ne İzlesek?</button>
          <button className={aktifSayfa === 'cinetinder' ? 'aktif' : ''} onClick={() => { sayfaDegistir('cinetinder'); if(tinderFilmleri.length === 0) tinderFilmleriGetir(1); }}>🔥 CineMatch Modu</button>
          <button className={aktifSayfa === 'izlemelistesi' ? 'aktif' : ''} onClick={() => sayfaDegistir('izlemelistesi')}>💖 Eşleşmelerim ({izlemeListesi.length})</button>
          <button className={aktifSayfa === 'kelimeoyunu' ? 'aktif' : ''} onClick={() => sayfaDegistir('kelimeoyunu')}>Kelime Oyunu 🎲</button>
        </div>
      </nav>

      <div className={`app-container ${aktifSayfa === 'detay' ? 'genis-kutu' : ''}`}>
        
        {/* ANA SAYFA */}
        {aktifSayfa === 'anasayfa' && (
          <div className="anasayfa-icerik">
            {vitrinFilmi && (
              <div 
                className="vitrin-alani" 
                style={{ backgroundImage: `linear-gradient(to top, #0f172a 0%, rgba(15, 23, 42, 0.1) 100%), url(https://image.tmdb.org/t/p/original${vitrinFilmi.backdrop_path})` }}
              >
                <div className="vitrin-icerik">
                  <h1 className="vitrin-baslik">{vitrinFilmi.title}</h1>
                  <p className="vitrin-ozet">
                    {vitrinFilmi.overview ? vitrinFilmi.overview.substring(0, 180) + "..." : "Dünya çapında milyonların izlediği bu başyapıtı keşfet. Sürükleyici hikayesi ve inanılmaz görselliğiyle seni bekliyor."}
                  </p>
                  <div className="vitrin-butonlar">
                    <button className="dev-buton oynat-buton" onClick={() => detayGetir(vitrinFilmi.id)}>▶ İncele</button>
                    <button className="dev-buton ikinci" onClick={() => sayfaDegistir('kelimeoyunu')}>🔮 Oyuna Başla</button>
                  </div>
                </div>
              </div>
            )}

            <div className="film-kategorileri">
              <div className="film-seridi-alani">
                <h2>🔥 Gündemdeki Filmler</h2>
                <div className="film-seridi">
                  {populerFilmler.map(f => (
                    <div key={f.id} className="mini-afis-karti" onClick={() => detayGetir(f.id)}>
                      <img src={`https://image.tmdb.org/t/p/w300${f.poster_path}`} alt={f.title} />
                      <div className="kart-golge"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="film-seridi-alani">
                <h2>🌟 Başyapıtlar</h2>
                <div className="film-seridi">
                  {onerilenFilmler.map(f => (
                    <div key={f.id} className="mini-afis-karti" onClick={() => detayGetir(f.id)}>
                      <img src={`https://image.tmdb.org/t/p/w300${f.poster_path}`} alt={f.title} />
                      <div className="kart-golge"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NE İZLESEK SAYFASI */}
        {aktifSayfa === 'neizlesek' && (
          <div className="filtre-alani" style={{marginTop: '100px'}}>
            <h1>🎬 Ne İzlesek?</h1>
            <p>Kriterlerini belirle, havuzdan sana en uygun olanı çekelim!</p>
            <div className="filtre-grubu">
              <label>🎭 Film Türü:</label>
              <select value={secilenTur} onChange={(e) => setSecilenTur(e.target.value)}>
                <option value="">Fark Etmez</option>
                <option value="28">💥 Aksiyon</option>
                <option value="35">😂 Komedi</option>
                <option value="27">😱 Korku</option>
                <option value="878">🚀 Bilim Kurgu</option>
                <option value="10749">💖 Romantik</option>
              </select>
            </div>
            <div className="filtre-grubu">
              <label>🌍 Üretim Yeri:</label>
              <select value={secilenDil} onChange={(e) => setSecilenDil(e.target.value)}>
                <option value="">Fark Etmez</option>
                <option value="tr">🇹🇷 Sadece Yerli</option>
                <option value="en">🇺🇸 Sadece Yabancı</option>
              </select>
            </div>
            <div className="filtre-grubu">
              <label>⏱️ Film Süresi:</label>
              <select value={secilenSure} onChange={(e) => setSecilenSure(e.target.value)}>
                <option value="">Fark Etmez</option>
                <option value="kisa">Çıtır Çerezlik</option>
                <option value="normal">Standart (1.5 - 2.5 saat)</option>
                <option value="uzun">Destansı (2.5 saat+)</option>
              </select>
            </div>
            <div className="filtre-grubu">
              <label>⭐ Minimum TMDB Puanı:</label>
              <select value={secilenPuan} onChange={(e) => setSecilenPuan(e.target.value)}>
                <option value="">Fark Etmez</option>
                <option value="6">6.0 ve Üzeri</option>
                <option value="7">7.0 ve Üzeri</option>
                <option value="8">8.0 ve Üzeri</option>
              </select>
            </div>
            <button onClick={filmiBul} disabled={yukleniyor} style={{ marginTop: '10px' }}>
              {yukleniyor ? "Aranıyor... 🍿" : "Bana Film Bul"}
            </button>
          </div>
        )}

        {/* 🔥 CINETINDER (MATCH) SAYFASI */}
        {aktifSayfa === 'cinetinder' && (
          <div className="cinetinder-alani" style={{marginTop: '100px'}}>
            <h1>🔥 Kaderini Kaydır</h1>
            <p>Sola kaydır geç, sağa kaydır eşleş! Eşleştiğin filmler listene eklensin.</p>

            {yukleniyor && tinderFilmleri.length === 0 ? (
               <h2 className="yukleniyor-yazisi">Kaderindeki filmler aranıyor... 🔮</h2>
            ) : tinderFilmleri.length > 0 ? (
               <div className={`tinder-karti ${kartAnimasyonu}`}>
                 <img src={`https://image.tmdb.org/t/p/w500${tinderFilmleri[0].poster_path}`} alt="afis" />
                 
                 <div className="tinder-kart-bilgi">
                   <h2>{tinderFilmleri[0].title}</h2>
                   <p>⭐ {tinderFilmleri[0].vote_average.toFixed(1)}/10</p>
                 </div>
                 
                 <div className="tinder-butonlar">
                   <button className="tinder-gec" onClick={() => tinderIslem('pass', tinderFilmleri[0])}>❌ Geç</button>
                   <button className="tinder-esles" onClick={() => tinderIslem('match', tinderFilmleri[0])}>💖 Eşleş</button>
                 </div>
                 
                 <button className="tinder-detay-buton" onClick={() => detayGetir(tinderFilmleri[0].id)}>ℹ️ Konusunu Oku</button>
               </div>
            ) : null}
          </div>
        )}

        {/* 💖 EŞLEŞMELERİM (İZLEME LİSTESİ) SAYFASI */}
        {aktifSayfa === 'izlemelistesi' && (
          <div className="izleme-listesi-alani" style={{marginTop: '100px', textAlign: 'center'}}>
            <h1>💖 Senin Seçtiklerin</h1>
            {izlemeListesi.length === 0 ? (
              <p>Henüz kimseyle eşleşmedin. CineMatch moduna dön ve kalbini sinemaya aç!</p>
            ) : (
              <div className="film-seridi" style={{flexWrap: 'wrap', justifyContent: 'center'}}>
                {izlemeListesi.map(f => (
                  <div key={f.id} className="mini-afis-karti" onClick={() => detayGetir(f.id)} style={{margin: '10px'}}>
                    <img src={`https://image.tmdb.org/t/p/w300${f.poster_path}`} alt={f.title} />
                    <div className="kart-golge"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* KELİME OYUNU SAYFASI */}
        {aktifSayfa === 'kelimeoyunu' && (
          <div className="kelime-oyunu-alani" style={{marginTop: '100px'}}>
            <h1>🔮 Kaderini Seç</h1>
            <p>İçgüdülerine güven ve seni çeken bir kelimeye tıkla.</p>
            {yukleniyor ? <h2 className="yukleniyor-yazisi">Kaderin Ağları Örülüyor... 🕸️</h2> : (
              <div className="kelime-havuzu">
                {sihirliKelimeler.map((kelime, index) => (
                  <button key={index} className="kelime-butonu" onClick={() => kelimeIleFilmBul(kelime)}>{kelime}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FİLM DETAY SAYFASI */}
        {aktifSayfa === 'detay' && film && (
          <div className="sonuc-alani" style={{marginTop: '100px'}}>
            <div className="film-sol">
              {film.poster_path && <img src={`https://image.tmdb.org/t/p/w500${film.poster_path}`} alt={film.title} className="film-afisi" />}
            </div>
            <div className="film-sag">
              <h2>{film.title}</h2>
              <p className="film-puani">⭐ TMDB Puanı: {film.vote_average.toFixed(1)}/10</p>
              <div className="film-etiketleri">
                {film.genres && film.genres.map(tur => <span key={tur.id} className="etiket">{tur.name}</span>)}
                {film.runtime > 0 && <span className="etiket sure-etiket">⏱️ {film.runtime} dk</span>}
              </div>
              <p className="film-ozeti">{film.overview ? film.overview : "Bu filmin Türkçe özeti bulunmuyor."}</p>

              {film.credits && film.credits.cast && film.credits.cast.length > 0 && (
                <div className="oyuncular-alani">
                  <h3>🎭 Başroller</h3>
                  <div className="oyuncu-listesi">
                    {film.credits.cast.slice(0, 4).map((oyuncu) => (
                      <div key={oyuncu.id} className="oyuncu-karti">
                        {oyuncu.profile_path ? <img src={`https://image.tmdb.org/t/p/w200${oyuncu.profile_path}`} alt={oyuncu.name} /> : <div className="oyuncu-yok">👤</div>}
                        <p className="oyuncu-isim">{oyuncu.name}</p>
                        <p className="oyuncu-rol">{oyuncu.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {fragman && (
                <div className="fragman-alani">
                  <h3>🎬 Fragman</h3>
                  <iframe width="100%" height="200" src={`https://www.youtube.com/embed/${fragman.key}`} title="YouTube" frameBorder="0" allowFullScreen style={{ borderRadius: '15px' }}></iframe>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;