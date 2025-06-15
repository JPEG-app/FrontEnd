import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg'; 
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'User Avatar', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',  
    md: 'w-10 h-10', 
    lg: 'w-12 h-12', 
  };

  const fallbackSrc = `https://via.placeholder.com/150/CCCCCC/FFFFFF?text=${alt.substring(0,1)}`

  return (
    <img
      src={src || fallbackSrc}
      alt={alt}
      className={`
        ${sizeClasses[size]}  
        rounded-full       
        object-cover      
        bg-gray-500   
      `}
    />
  );
};

export default Avatar;