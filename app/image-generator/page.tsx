"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandMagicSparkles,
  faMoon,
  faSun,
  faDice,
  faWandSparkles,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "./styles.css";
import { useRouter } from "next/navigation";

interface ImageCard {
  id: number;
  url: string;
  status: "loading" | "error" | "success";
  errorMessage?: string;
}

const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
  "A cosmic beach with glowing sand and an aurora in the night sky",
  "A medieval marketplace with colorful tents and street performers",
  "A cyberpunk city with neon signs and flying cars at night",
  "A peaceful bamboo forest with a hidden ancient temple",
  "A giant turtle carrying a village on its back in the ocean",
];

const API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

export default function ImageGenerator() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [imageCount, setImageCount] = useState(1);
  const [aspectRatio, setAspectRatio] = useState("1/1");
  const [images, setImages] = useState<ImageCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    document.body.classList.toggle("dark-theme", initialTheme);
  }, []);

  const getImageDimensions = (aspectRatio: string, baseSize = 512) => {
    const [width, height] = aspectRatio.split("/").map(Number);
    const scaleFactor = baseSize / Math.sqrt(width * height);
    let calculatedWidth = Math.round(width * scaleFactor);
    let calculatedHeight = Math.round(height * scaleFactor);
    calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
    calculatedHeight = Math.floor(calculatedHeight / 16) * 16;
    return { width: calculatedWidth, height: calculatedHeight };
  };

  const handleRandomPrompt = () => {
    const randomPrompt =
      examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    setPrompt(randomPrompt);
  };

  const generateImages = async () => {
    if (!selectedModel || !prompt.trim()) return;

    if (!API_KEY) {
      console.error("API key is missing. Please check your .env.local file");
      setImages([
        {
          id: 0,
          url: "",
          status: "error",
          errorMessage: "API key is missing. Please check your .env.local file",
        },
      ]);
      return;
    }

    setIsGenerating(true);
    const { width, height } = getImageDimensions(aspectRatio);
    const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;

    // Initialize image cards
    const initialImages = Array.from({ length: imageCount }, (_, i) => ({
      id: i,
      url: "",
      status: "loading" as const,
    }));
    setImages(initialImages);

    try {
      const imagePromises = initialImages.map(async (image) => {
        try {
          const response = await fetch(MODEL_URL, {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
              "X-use-cache": "false",
            },
            method: "POST",
            body: JSON.stringify({
              inputs: prompt,
              parameters: { width, height },
              options: { wait_for_model: true, use_cache: false },
            }),
          });

          if (!response.ok) {
            throw new Error((await response.json())?.error);
          }

          const result = await response.blob();
          return {
            ...image,
            url: URL.createObjectURL(result),
            status: "success" as const,
          };
        } catch (error) {
          console.error("Generation error:", error);
          return {
            ...image,
            status: "error" as const,
            errorMessage:
              error instanceof Error
                ? error.message
                : "Generation failed! Check console for details.",
          };
        }
      });

      const results = await Promise.all(imagePromises);
      setImages(results);
    } catch (error) {
      console.error("Main error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateImages();
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "transformations") {
      router.push("/transformations/add");
    } else {
      setSelectedModel(value);
    }
  };

  return (
    <div className="centered-generator">
      
      <div className="image-generator">
        <h1 className="h1-semibold">Generate Image</h1>
        <p className="subtitle"></p>
        <form onSubmit={handleSubmit} className="prompt-form">
          <div className="prompt-container">
            <textarea
              className="prompt-input"
              placeholder="Describe your imagination in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              autoFocus
            />
            <button
              type="button"
              className="prompt-btn"
              onClick={handleRandomPrompt}
            >
              <FontAwesomeIcon icon={faDice} />
            </button>
          </div>

          <div className="prompt-actions">
            <div className="select-wrapper">
              <select
                className="custom-select"
                value={selectedModel}
                onChange={handleModelChange}
                required
              >
                <option value="" disabled>
                  Select Model
                </option>
                <option value="black-forest-labs/FLUX.1-dev">High Quality</option>
                <option value="stabilityai/stable-diffusion-3.5-large">
                  Smart Design
                </option>
                <option value="black-forest-labs/FLUX.1-schnell">
                  Fast Generation
                </option>
              </select>
            </div>

            <div className="select-wrapper">
              <select
                className="custom-select"
                value={imageCount}
                onChange={(e) => setImageCount(Number(e.target.value))}
                required
              >
                <option value="" disabled>
                  Image Count
                </option>
                <option value="1">1 Image</option>
                <option value="2">2 Images</option>
                <option value="3">3 Images</option>
                <option value="4">4 Images</option>
              </select>
            </div>

            <div className="select-wrapper">
              <select
                className="custom-select"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                required
              >
                <option value="" disabled>
                  Aspect Ratio
                </option>
                <option value="1/1">Square (1:1)</option>
                <option value="16/9">Landscape (16:9)</option>
                <option value="9/16">Portrait (9:16)</option>
              </select>
            </div>

            <button
              type="submit"
              className="generate-btn"
              disabled={isGenerating}
            >
              <FontAwesomeIcon icon={faWandSparkles} />
              Generate
            </button>
          </div>

          <div className="gallery-grid">
            {images.map((image) => (
              <div
                key={image.id}
                className={`img-card ${image.status}`}
                style={{ aspectRatio }}
              >
                {image.status === "loading" && (
                  <div className="status-container">
                    <div className="spinner"></div>
                    <p className="status-text">Generating...</p>
                  </div>
                )}

                {image.status === "error" && (
                  <div className="status-container">
                    <FontAwesomeIcon icon={faWandSparkles} />
                    <p className="status-text">{image.errorMessage}</p>
                  </div>
                )}

                {image.status === "success" && (
                  <>
                    <img
                      src={image.url}
                      alt=""
                      className="result-img"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="img-overlay">
                      <a
                        href={image.url}
                        download={`${Date.now()}.png`}
                        className="img-download-btn"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </a>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
