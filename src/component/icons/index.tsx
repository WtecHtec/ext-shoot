import React, {useEffect, useState} from 'react';

export function Logo({
  children,
  size = "20px"
}: {
  children: React.ReactNode
  size?: string
}) {
  return (
    <div
      className="blurLogo"
      style={{
        width: size,
        height: size
      }}>
      <div className="bg" aria-hidden>
        {children}
      </div>
      <div className="inner">{children}</div>
    </div>
  )
}

export function FigmaIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="48px"
      height="48px">
      <path
        fill="#e64a19"
        d="M26,17h-8c-3.866,0-7-3.134-7-7v0c0-3.866,3.134-7,7-7h8V17z"
      />
      <path
        fill="#7c4dff"
        d="M25,31h-7c-3.866,0-7-3.134-7-7v0c0-3.866,3.134-7,7-7h7V31z"
      />
      <path
        fill="#66bb6a"
        d="M18,45L18,45c-3.866,0-7-3.134-7-7v0c0-3.866,3.134-7,7-7h7v7C25,41.866,21.866,45,18,45z"
      />
      <path
        fill="#ff7043"
        d="M32,17h-7V3h7c3.866,0,7,3.134,7,7v0C39,13.866,35.866,17,32,17z"
      />
      <circle cx="32" cy="24" r="7" fill="#29b6f6" />
    </svg>
  )
}

export function RaycastIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 18.073V20.994L0 13.994L1.46 12.534L7 18.075V18.073ZM9.921 20.994H7L14 27.994L15.46 26.534L9.921 20.994V20.994ZM26.535 15.456L27.996 13.994L13.996 -0.00598145L12.538 1.46002L18.077 6.99802H14.73L10.864 3.14002L9.404 4.60002L11.809 7.00402H10.129V17.87H20.994V16.19L23.399 18.594L24.859 17.134L20.994 13.268V9.92102L26.534 15.456H26.535ZM7.73 6.27002L6.265 7.73202L7.833 9.29802L9.294 7.83802L7.73 6.27002ZM20.162 18.702L18.702 20.164L20.268 21.732L21.73 20.27L20.162 18.702V18.702ZM4.596 9.40402L3.134 10.866L7 14.732V11.809L4.596 9.40402ZM16.192 21H13.268L17.134 24.866L18.596 23.404L16.192 21Z"
        fill="#FF6363"
      />
    </svg>
  )
}

export function YouTubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="48px"
      height="48px">
      <path
        fill="#FF3D00"
        d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"
      />
      <path fill="#FFF" d="M20 31L20 17 32 24z" />
    </svg>
  )
}

export function SlackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="48px"
      height="48px">
      <path
        fill="#33d375"
        d="M33,8c0-2.209-1.791-4-4-4s-4,1.791-4,4c0,1.254,0,9.741,0,11c0,2.209,1.791,4,4,4s4-1.791,4-4	C33,17.741,33,9.254,33,8z"
      />
      <path
        fill="#33d375"
        d="M43,19c0,2.209-1.791,4-4,4c-1.195,0-4,0-4,0s0-2.986,0-4c0-2.209,1.791-4,4-4S43,16.791,43,19z"
      />
      <path
        fill="#40c4ff"
        d="M8,14c-2.209,0-4,1.791-4,4s1.791,4,4,4c1.254,0,9.741,0,11,0c2.209,0,4-1.791,4-4s-1.791-4-4-4	C17.741,14,9.254,14,8,14z"
      />
      <path
        fill="#40c4ff"
        d="M19,4c2.209,0,4,1.791,4,4c0,1.195,0,4,0,4s-2.986,0-4,0c-2.209,0-4-1.791-4-4S16.791,4,19,4z"
      />
      <path
        fill="#e91e63"
        d="M14,39.006C14,41.212,15.791,43,18,43s4-1.788,4-3.994c0-1.252,0-9.727,0-10.984	c0-2.206-1.791-3.994-4-3.994s-4,1.788-4,3.994C14,29.279,14,37.754,14,39.006z"
      />
      <path
        fill="#e91e63"
        d="M4,28.022c0-2.206,1.791-3.994,4-3.994c1.195,0,4,0,4,0s0,2.981,0,3.994c0,2.206-1.791,3.994-4,3.994	S4,30.228,4,28.022z"
      />
      <path
        fill="#ffc107"
        d="M39,33c2.209,0,4-1.791,4-4s-1.791-4-4-4c-1.254,0-9.741,0-11,0c-2.209,0-4,1.791-4,4s1.791,4,4,4	C29.258,33,37.746,33,39,33z"
      />
      <path
        fill="#ffc107"
        d="M28,43c-2.209,0-4-1.791-4-4c0-1.195,0-4,0-4s2.986,0,4,0c2.209,0,4,1.791,4,4S30.209,43,28,43z"
      />
    </svg>
  )
}

export function VercelIcon() {
  return (
    <svg
      aria-label="Vercel Logo"
      fill="var(--highContrast)"
      height="26"
      viewBox="0 0 75 65">
      <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
    </svg>
  )
}

export function LinearIcon({ style }: { style?: Object }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={style}>
      <path
        d="M0.403013 37.3991L26.6009 63.597C13.2225 61.3356 2.66442 50.7775 0.403013 37.3991Z"
        fill="#5E6AD2"></path>
      <path
        d="M0 30.2868L33.7132 64C35.7182 63.8929 37.6742 63.6013 39.5645 63.142L0.85799 24.4355C0.398679 26.3259 0.10713 28.2818 0 30.2868Z"
        fill="#5E6AD2"></path>
      <path
        d="M2.53593 19.4042L44.5958 61.4641C46.1277 60.8066 47.598 60.0331 48.9956 59.1546L4.84543 15.0044C3.96691 16.402 3.19339 17.8723 2.53593 19.4042Z"
        fill="#5E6AD2"></path>
      <path
        d="M7.69501 11.1447C13.5677 4.32093 22.2677 0 31.9769 0C49.6628 0 64 14.3372 64 32.0231C64 41.7323 59.6791 50.4323 52.8553 56.305L7.69501 11.1447Z"
        fill="#5E6AD2"></path>
    </svg>
  )
}

export function CopyIcon() {
  return (
    <svg
      width="16"
      height="16"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      fill="none">
      <path
        d="M19.4 20H9.6C9.26863 20 9 19.7314 9 19.4V9.6C9 9.26863 9.26863 9 9.6 9H19.4C19.7314 9 20 9.26863 20 9.6V19.4C20 19.7314 19.7314 20 19.4 20Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 9V4.6C15 4.26863 14.7314 4 14.4 4H4.6C4.26863 4 4 4.26863 4 4.6V14.4C4 14.7314 4.26863 15 4.6 15H9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CopiedIcon() {
  return (
    <svg
      width="16"
      height="16"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 13L9 17L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GitHubIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 0.175049C3.128 0.175049 0 3.30305 0 7.17505C0 10.259 2.013 12.885 4.79 13.825C5.14 13.891 5.272 13.672 5.272 13.497V12.316C3.325 12.731 2.909 11.375 2.909 11.375C2.581 10.565 2.122 10.347 2.122 10.347C1.488 9.90905 2.166 9.93105 2.166 9.93105C2.866 9.97505 3.237 10.653 3.237 10.653C3.872 11.725 4.878 11.419 5.272 11.243C5.338 10.784 5.512 10.478 5.709 10.303C4.156 10.128 2.516 9.51605 2.516 6.84705C2.516 6.08105 2.778 5.46905 3.237 4.96605C3.172 4.79105 2.931 4.06905 3.303 3.10605C3.303 3.10605 3.893 2.90905 5.228 3.82805C5.79831 3.67179 6.38668 3.5911 6.978 3.58805C7.568 3.58805 8.181 3.67505 8.728 3.82805C10.063 2.93105 10.653 3.10605 10.653 3.10605C11.025 4.06905 10.784 4.79105 10.719 4.96605C11.179 5.44605 11.441 6.08105 11.441 6.84605C11.441 9.53705 9.8 10.128 8.247 10.303C8.487 10.522 8.728 10.937 8.728 11.593V13.519C8.728 13.716 8.859 13.934 9.209 13.847C11.988 12.884 14 10.259 14 7.17505C14 3.30305 10.872 0.175049 7 0.175049V0.175049Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function FramerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 24">
      <path
        d="M 16 0 L 16 8 L 8 8 L 0 0 Z M 0 8 L 8 8 L 16 16 L 8 16 L 8 24 L 0 16 Z"
        fill="var(--highContrast)"></path>
    </svg>
  )
}

export function ShootIcon() {
    return (
        <svg
            width="1024"
            height="1024"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M224 288.002L800 192.002V304.002L224 400.002V288.002ZM224 512.002L800 416.002V528.002L224 624.002V512.002ZM224 736.002L800 640.002V752.002L224 848.002V736.002Z"
                fill="#888888"
                stroke="#888888"
                strokeWidth="64"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function WindowIcon() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M14.25 4.75V3.75C14.25 2.64543 13.3546 1.75 12.25 1.75H3.75C2.64543 1.75 1.75 2.64543 1.75 3.75V4.75M14.25 4.75V12.25C14.25 13.3546 13.3546 14.25 12.25 14.25H3.75C2.64543 14.25 1.75 13.3546 1.75 12.25V4.75M14.25 4.75H1.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function FinderIcon() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5 4.75V6.25M11 4.75V6.25M8.75 1.75H3.75C2.64543 1.75 1.75 2.64543 1.75 3.75V12.25C1.75 13.3546 2.64543 14.25 3.75 14.25H8.75M8.75 1.75H12.25C13.3546 1.75 14.25 2.64543 14.25 3.75V12.25C14.25 13.3546 13.3546 14.25 12.25 14.25H8.75M8.75 1.75L7.08831 7.1505C6.9202 7.69686 7.32873 8.25 7.90037 8.25C8.36961 8.25 8.75 8.63039 8.75 9.09963V14.25M5 10.3203C5 10.3203 5.95605 11.25 8 11.25C10.0439 11.25 11 10.3203 11 10.3203"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function StarIcon() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.43376 2.17103C7.60585 1.60966 8.39415 1.60966 8.56624 2.17103L9.61978 5.60769C9.69652 5.85802 9.92611 6.02873 10.186 6.02873H13.6562C14.2231 6.02873 14.4665 6.75397 14.016 7.10088L11.1582 9.3015C10.9608 9.45349 10.8784 9.71341 10.9518 9.95262L12.0311 13.4735C12.2015 14.0292 11.5636 14.4777 11.1051 14.1246L8.35978 12.0106C8.14737 11.847 7.85263 11.847 7.64022 12.0106L4.89491 14.1246C4.43638 14.4777 3.79852 14.0292 3.96889 13.4735L5.04824 9.95262C5.12157 9.71341 5.03915 9.45349 4.84178 9.3015L1.98404 7.10088C1.53355 6.75397 1.77692 6.02873 2.34382 6.02873H5.81398C6.07389 6.02873 6.30348 5.85802 6.38022 5.60769L7.43376 2.17103Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ClipboardIcon() {
    return (
        <div cmdk-raycast-clipboard-icon="">
            <svg
                width="32"
                height="32"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.07512 2.75H4.75C3.64543 2.75 2.75 3.64543 2.75 4.75V12.25C2.75 13.3546 3.64543 14.25 4.75 14.25H11.25C12.3546 14.25 13.25 13.3546 13.25 12.25V4.75C13.25 3.64543 12.3546 2.75 11.25 2.75H9.92488M9.88579 3.02472L9.5934 4.04809C9.39014 4.75952 8.73989 5.25 8 5.25V5.25C7.26011 5.25 6.60986 4.75952 6.4066 4.04809L6.11421 3.02472C5.93169 2.38591 6.41135 1.75 7.07573 1.75H8.92427C9.58865 1.75 10.0683 2.3859 9.88579 3.02472Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

export function UpdateInfoIcon() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4425">
            <path
                d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 640a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m0-512a64 64 0 0 0-64 64v320a64 64 0 1 0 128 0V256a64 64 0 0 0-64-64z"
                fill="#d81e06"></path>
        </svg>
    );
}

export function HammerIcon() {
    return (
        <div cmdk-raycast-hammer-icon="">
            <svg
                width="32"
                height="32"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.73762 6.19288L2.0488 11.2217C1.6504 11.649 1.6504 12.3418 2.0488 12.769L3.13083 13.9295C3.52923 14.3568 4.17515 14.3568 4.57355 13.9295L9.26238 8.90071M6.73762 6.19288L7.0983 5.80605C7.4967 5.37877 7.4967 4.686 7.0983 4.25872L6.01627 3.09822L6.37694 2.71139C7.57213 1.42954 9.50991 1.42954 10.7051 2.71139L13.9512 6.19288C14.3496 6.62017 14.3496 7.31293 13.9512 7.74021L12.8692 8.90071C12.4708 9.328 11.8248 9.328 11.4265 8.90071L11.0658 8.51388C10.6674 8.0866 10.0215 8.0866 9.62306 8.51388L9.26238 8.90071M6.73762 6.19288L9.26238 8.90071"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

export function ExtensionIcon({ base64 = '' }) {
    const [iconUrl, setIconUrl] = useState('');

    // useEffect(() => {
    //     handleGetExtensionIcon(extensionId, iconSize).then(([err, response]) => {
    //         if (err) {
    //             console.error('Error fetching extension icon:', err);
    //             return;
    //         }
    //         if (response && response.status === 'Icon fetched') {
    //             setIconUrl(response.iconDataUrl);
    //         } else {
    //             console.error('Failed to fetch extension icon:', response.status);
    //         }
    //     });
    // }, [extensionId, iconSize]);

    useEffect(() => {
        setIconUrl(base64);
    }, [base64]);

    return (
        <Logo>
            <img src={ iconUrl } crossOrigin="anonymous"></img>
        </Logo>
    );
}
