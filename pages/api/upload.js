import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { file } = req.body;

    try {
      const uploadResponse = await cloudinary.uploader.upload(file, {
        resource_type: 'video',
      });

      res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      res.status(500).json({ error: 'Échec du téléversement.' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée.' });
  }
}
