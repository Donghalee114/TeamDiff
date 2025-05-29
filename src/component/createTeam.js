import { useState  , useCallback, useEffect} from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/gettingCrop';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';

export default function CreateTeam() {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  
  const [previewUrl, setPreviewUrl] = useState('');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [teamList, setTeamList] = useState([]);

const onCropComplete = useCallback((croppedArea, croppedPixels) => {
  setCroppedAreaPixels(croppedPixels);
}, []);

const threeLetterRegex = (e) => {
  const value = e.target.value;
  if (value.length > 3) {
    e.target.value = value.slice(0, 3);
  }
  setShortName(e.target.value);
}

const handleFileChange = (e) => {
  const file = e.target.files[0];
  setLogoFile(file);
  setPreviewUrl(URL.createObjectURL(file));
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
  const formData = new FormData();
  formData.append('name', name);
  formData.append('shortName', shortName);
  formData.append('logo', croppedBlob, 'logo.png');

  const res = await fetch(`${BASE_URL}/maketeam/upload`, {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    alert('팀이 생성되었습니다!');
  }
};

const handleTeamList = async () => {
  const res = await fetch(`${BASE_URL}/maketeam/selectTeams`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (res.ok) {
    const data = await res.json();
    const teamdata = data.map(team => ({
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      logoUrl: team.logoUrl
    }));


    setTeamList(teamdata);
 
  } else {
    console.error('팀 목록을 불러오는 데 실패했습니다.');
  }
}

useEffect(() => {
  handleTeamList();
  console.log(teamList[1]);
}
, []);

  return (
    <>
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }} encType="multipart/form-data">
      <h2>팀 생성</h2>
      <input type="text" placeholder="팀 이름" value={name} onChange={e => setName(e.target.value)} required />
      <input type="text" placeholder="팀 약어 (3글자)" value={shortName} onChange={e => threeLetterRegex(e)} required />
     <input type="file" name='logo' accept="image/*" onChange={handleFileChange} required />
      
  {previewUrl && (
  <div style={{ position: 'relative', width: 300, height: 300 }}>
    <Cropper
      image={previewUrl}
      crop={crop}
      zoom={zoom}
      aspect={1} // 정사각형
      onCropChange={setCrop}
      onZoomChange={setZoom}
      onCropComplete={onCropComplete}
    />
  </div>


)}

      <button type="submit">생성</button>
    </form>

    <div>
      <h2>팀 목록</h2>
      <ul>
        {teamList.map(team => (
          <span key={team.id}>
            <img src={`${BASE_URL}${team.logoUrl}`}  style={{ width: '50px', height: '50px', borderRadius: '8px' }} />
            <strong>{team.name}</strong> ({team.shortName}) - ID: {team.id}
          </span>
        ))}
      </ul>
    </div>
    </>
  );
}
