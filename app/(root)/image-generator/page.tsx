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
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
//import "./styles.css";
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
    <>
      <h1 className="text-center pt-8 h1-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
        Generate Image
      </h1>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-transparent">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            className="w-full min-h-[120px] rounded-xl border-2 border-purple-100/50 dark:border-gray-700/50 bg-transparent p-4 text-black dark:text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200/50 dark:focus:ring-purple-700/50 placeholder-black/70 dark:placeholder-white/70"
            placeholder="Describe your imagination in detail..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            autoFocus
          />
          <button
            type="button"
            className="absolute bottom-4 right-4 rounded-full bg-purple-500/80 p-2 text-white transition-all hover:bg-purple-600 hover:shadow-md"
            onClick={handleRandomPrompt}
          >
            <FontAwesomeIcon icon={faDice} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 max-w-4xl mx-auto">
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border-2 border-purple-100/50 dark:border-gray-700/50 bg-transparent p-3 pr-10 text-black dark:text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200/50 dark:focus:ring-purple-700/50"
              value={selectedModel}
              onChange={handleModelChange}
              required
            >
              <option value="" disabled className="text-black dark:text-white bg-white dark:bg-gray-900">Select Model</option>
              <option value="black-forest-labs/FLUX.1-dev" className="text-black dark:text-white bg-white dark:bg-gray-900">High Quality</option>
              <option value="stabilityai/stable-diffusion-3.5-large" className="text-black dark:text-white bg-white dark:bg-gray-900">Smart Design</option>
              <option value="black-forest-labs/FLUX.1-schnell" className="text-black dark:text-white bg-white dark:bg-gray-900">Fast Generation</option>
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 dark:text-white/70 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border-2 border-purple-100/50 dark:border-gray-700/50 bg-transparent p-3 pr-10 text-black dark:text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200/50 dark:focus:ring-purple-700/50"
              value={imageCount}
              onChange={(e) => setImageCount(Number(e.target.value))}
              required
            >
              <option value="" disabled className="text-black dark:text-white bg-white dark:bg-gray-900">Image Count</option>
              <option value="1" className="text-black dark:text-white bg-white dark:bg-gray-900">1 Image</option>
              <option value="2" className="text-black dark:text-white bg-white dark:bg-gray-900">2 Images</option>
              <option value="3" className="text-black dark:text-white bg-white dark:bg-gray-900">3 Images</option>
              <option value="4" className="text-black dark:text-white bg-white dark:bg-gray-900">4 Images</option>
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 dark:text-white/70 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border-2 border-purple-100/50 dark:border-gray-700/50 bg-transparent p-3 pr-10 text-black dark:text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200/50 dark:focus:ring-purple-700/50"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              required
            >
              <option value="" disabled className="text-black dark:text-white bg-white dark:bg-gray-900">Aspect Ratio</option>
              <option value="1/1" className="text-black dark:text-white bg-white dark:bg-gray-900">Square (1:1)</option>
              <option value="16/9" className="text-black dark:text-white bg-white dark:bg-gray-900">Landscape (16:9)</option>
              <option value="9/16" className="text-black dark:text-white bg-white dark:bg-gray-900">Portrait (9:16)</option>
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 dark:text-white/70 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-500/80 px-6 py-3 font-medium text-white transition-all hover:bg-purple-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isGenerating}
          >
            <FontAwesomeIcon icon={faWandSparkles} />
            Generate
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 border-purple-100 dark:border-gray-700 bg-white dark:bg-black ${
                image.status === "loading" ? "animate-pulse" : ""
              }`}
            >
              {image.status === "loading" && (
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-500"></div>
                  <p className="mt-4 text-gray-500">Generating...</p>
                </div>
              )}

              {image.status === "error" && (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <FontAwesomeIcon icon={faWandSparkles} className="mb-4 text-2xl text-red-500" />
                  <p className="text-red-500">{image.errorMessage}</p>
                </div>
              )}

              {image.status === "success" && (
                <>
                  <img
                    src={image.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100">
                    <a
                      href={image.url}
                      download={`${Date.now()}.png`}
                      className="rounded-full bg-white p-3 text-purple-500 transition-transform hover:scale-110"
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
    </>
  );
}
