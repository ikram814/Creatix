"use client";

import React from "react";
import ImageGenerator from "@/app/image-generator/page";
import { useTheme } from "@/app/context/ThemeContext";

export default function GenerateImagePage() {
  const { isDarkTheme } = useTheme();

  return (
    <div className={`transformations-page ${isDarkTheme ? "dark-theme" : ""}`}>
      <div className="transformations-container">
        {/* <h1 className="transformations-title">Generate Image</h1> */}
        <div className="transformations-content">
          <ImageGenerator />
        </div>
      </div>
    </div>
  );
}
