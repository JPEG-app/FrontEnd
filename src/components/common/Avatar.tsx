import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg'; // Defines possible size variations
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'User Avatar', size = 'md' }) => {
  // Map the size prop to specific Tailwind width/height classes
  const sizeClasses = {
    sm: 'w-8 h-8',    // Small size (2rem x 2rem)
    md: 'w-10 h-10',  // Medium default size (2.5rem x 2.5rem)
    lg: 'w-12 h-12',  // Large size (3rem x 3rem)
    // You can add more sizes here if needed (e.g., xl: 'w-16 h-16')
  };

  // Fallback if src is missing (optional, generates a placeholder)
  const fallbackSrc = `https://via.placeholder.com/150/CCCCCC/FFFFFF?text=${alt.substring(0,1)}`

  return (
    <img
      src={src || fallbackSrc} // Use the imported local URL or fallback
      alt={alt}
      className={`
        ${sizeClasses[size]}   // Apply the dynamic width/height class
        rounded-full          // Make it circular
        object-cover          // Crop image to fit container, maintaining aspect ratio
        bg-gray-500           // Optional: background if image fails to load
      `}
    />
  );
};

export default Avatar;