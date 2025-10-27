import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReactDOM from 'react-dom';

// Function to convert a React component to an SVG string
function iconToSvg(icon: JSX.Element): string {
    const div = document.createElement('div');
    ReactDOM.render(icon, div);
    return encodeURIComponent(div.innerHTML);
}

// Convert the LocationOnIcon component to an SVG string
const locationIconUrl = `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${iconToSvg(
        <LocationOnIcon />
    )}</svg>`
)}`;

export default locationIconUrl;
