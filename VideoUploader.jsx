import { useState } from 'react';

export default function VideoUploader() {
  const [videoUrl, setVideoUrl] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result;

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: base64data }),
      });

      const data = await response.json();
      setVideoUrl(data.url);
    };
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleUpload} />
      {videoUrl && (
        <video width="600" controls>
          <source src={videoUrl} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      )}
    </div>
  );
}
