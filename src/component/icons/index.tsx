import React, {SVGProps, useEffect, useState} from 'react';

export function Logo({
                         children,
                         size = '20px',
                     }: {
    children: React.ReactNode
    size?: string
}) {
    return (
        <div
            className="blurLogo"
            style={ {
                width: size,
                height: size,
            } }>
            <div className="bg" aria-hidden>
                { children }
            </div>
            <div className="inner">{ children }</div>
        </div>
    );
}


export function ShootEmptyIcon() {
    return (

        <svg width="28"
             height="28" viewBox="0 0 479 479" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M104.781 134.72L374.219 89.8135V142.204L104.781 187.11V134.72ZM104.781 239.501L374.219 194.595V246.985L104.781 291.892V239.501ZM104.781 344.282L374.219 299.376V351.767L104.781 396.673V344.282Z"
                fill="#888888" stroke="#888888" stroke-width="29.9375"
                stroke-linecap="round"
                stroke-linejoin="round"/>
        </svg>
    );
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
    );
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
    );
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
    );
}

export function FramerIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 24">
            <path
                d="M 16 0 L 16 8 L 8 8 L 0 0 Z M 0 8 L 8 8 L 16 16 L 8 16 L 8 24 L 0 16 Z"
                fill="var(--highContrast)"></path>
        </svg>
    );
}

export function ShootIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="512"
            height="512"
            viewBox="0 0 512 512"
            fill="none"
            { ...props }
            xmlns="http://www.w3.org/2000/svg">
            <rect
                width="361.149"
                height="96.7897"
                rx="14.5382"
                transform="matrix(0.986286 -0.165048 0.0174524 0.999848 78.1147 368.687)"
                fill="#222831"
            />
            <rect
                width="360.659"
                height="96.7897"
                rx="14.5185"
                transform="matrix(0.986286 -0.165048 0.0174524 0.999848 76.9048 106.064)"
                fill="#76ABAE"
            />
            <rect
                width="360.659"
                height="96.7897"
                rx="14.5185"
                transform="matrix(0.986286 -0.165048 0.0174524 0.999848 76 237.94)"
                fill="#31363F"
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
            width="18"
            height="18"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4425">
            <path
                d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 640a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m0-512a64 64 0 0 0-64 64v320a64 64 0 1 0 128 0V256a64 64 0 0 0-64-64z"
                fill="currentColor"></path>
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

export function ExtensionIcon({ base64 = '' }: { base64?: string }) {
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

export function LineSpinnerIcon() {
    return (
        <>
            <div className="line-springer-container">
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
                <div className="line-springer-line"></div>
            </div>
        </>
    );
}

export function OpenRecentPageIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            { ...props }>
            <g fill="none" stroke="currentColor" strokeWidth="2">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.935 11.009V8.793a2.978 2.978 0 0 0-1.529-2.61l-5.957-3.307a2.978 2.978 0 0 0-2.898 0L4.594 6.182a2.978 2.978 0 0 0-1.529 2.611v6.414a2.978 2.978 0 0 0 1.529 2.61l5.957 3.307a2.978 2.978 0 0 0 2.898 0l2.522-1.4"></path>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.33 6.996L12 12L3.67 6.996M12 21.49V12"></path>
                <circle cx="20.329" cy="16.501" r="2.376"></circle>
            </g>
        </svg>
    );
}

export function CopyNameIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            { ...props }>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path
                    d="M18.327 7.286h-8.044a1.932 1.932 0 0 0-1.925 1.938v10.088c0 1.07.862 1.938 1.925 1.938h8.044a1.932 1.932 0 0 0 1.925-1.938V9.224c0-1.07-.862-1.938-1.925-1.938"></path>
                <path
                    d="M15.642 7.286V4.688c0-.514-.203-1.007-.564-1.37a1.918 1.918 0 0 0-1.361-.568H5.673c-.51 0-1 .204-1.36.568a1.945 1.945 0 0 0-.565 1.37v10.088c0 .514.203 1.007.564 1.37c.361.364.85.568 1.361.568h2.685"></path>
            </g>
        </svg>
    );
}

export function ShowInFinderIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            { ...props }>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path
                    d="M7.375 16.047h9.25m4.625-6.164v7.698a3.083 3.083 0 0 1-3.083 3.083H5.833a3.083 3.083 0 0 1-3.083-3.083V6.419a3.083 3.083 0 0 1 3.083-3.083h3.084a3.083 3.083 0 0 1 2.57 1.377l.873 1.326a1.748 1.748 0 0 0 1.449.77h4.358a3.084 3.084 0 0 1 3.083 3.074"></path>
                <path
                    d="m11.517 4.723l6.927-1.11a1.531 1.531 0 0 1 1.778 1.521v2.457"></path>
            </g>
        </svg>
    );
}

export function FreshIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            { ...props }>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2">
                <path
                    strokeMiterlimit="10"
                    d="M17.605 7.705A7.885 7.885 0 0 0 12 5.382a7.929 7.929 0 0 0-7.929 7.929A7.94 7.94 0 0 0 12 21.25a7.94 7.94 0 0 0 7.929-7.94"></path>
                <path
                    strokeLinejoin="round"
                    d="m16.88 2.75l.95 3.858a1.332 1.332 0 0 1-.97 1.609l-3.869.948"></path>
            </g>
        </svg>
    );
}

export function StarItIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            { ...props }>
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m12.495 18.587l4.092 2.15a1.044 1.044 0 0 0 1.514-1.106l-.783-4.552a1.045 1.045 0 0 1 .303-.929l3.31-3.226a1.043 1.043 0 0 0-.575-1.785l-4.572-.657A1.044 1.044 0 0 1 15 7.907l-2.088-4.175a1.044 1.044 0 0 0-1.88 0L8.947 7.907a1.044 1.044 0 0 1-.783.575l-4.51.657a1.044 1.044 0 0 0-.584 1.785l3.309 3.226a1.044 1.044 0 0 1 .303.93l-.783 4.55a1.044 1.044 0 0 0 1.513 1.107l4.093-2.15a1.043 1.043 0 0 1 .991 0"></path>
        </svg>
    );
}

export function UninstallIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            { ...props }>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path
                    d="M5.47 6.015v12.514a2.72 2.72 0 0 0 2.721 2.721h7.618a2.72 2.72 0 0 0 2.72-2.72V6.014m-15.235.001h17.412"></path>
                <path
                    d="M8.735 6.015V4.382a1.632 1.632 0 0 1 1.633-1.632h3.264a1.632 1.632 0 0 1 1.633 1.632v1.633m-5.984 6.081h5.438m-5.438 4.353h5.438"></path>
            </g>
        </svg>
    );
}

export function EnableIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            { ...props }>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2">
                <path
                    strokeLinejoin="round"
                    d="m16.219 17.114l-.51 2.959a1.164 1.164 0 0 1-2.213.093l-2.788-7.882A1.164 1.164 0 0 1 12.2 10.79l8.036 2.788a1.164 1.164 0 0 1-.116 2.234l-3.112.51a1.165 1.165 0 0 0-.79.791"></path>
                <path d="M21.502 9.314A9.726 9.726 0 1 0 9.297 21.5"></path>
            </g>
        </svg>
    );
}

export function DisableIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            { ...props }>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path d="M9.743 7.42a5.078 5.078 0 1 0 4.514 0M12 6.362v4.514"></path>
                <path d="M12 21.5a9.5 9.5 0 1 0 0-19a9.5 9.5 0 0 0 0 19"></path>
            </g>
        </svg>
    );
}

export function CameraIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            { ...props }>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path
                    d="M5.833 19.708h12.334a3.083 3.083 0 0 0 3.083-3.083V9.431a3.083 3.083 0 0 0-3.083-3.084h-1.419c-.408 0-.8-.163-1.09-.452l-1.15-1.151a1.542 1.542 0 0 0-1.09-.452h-2.836c-.41 0-.8.163-1.09.452l-1.15 1.151c-.29.29-.682.452-1.09.452H5.833A3.083 3.083 0 0 0 2.75 9.431v7.194a3.083 3.083 0 0 0 3.083 3.083"></path>
                <path
                    d="M12 16.625a4.111 4.111 0 1 0 0-8.222a4.111 4.111 0 0 0 0 8.222"></path>
            </g>
        </svg>
    );
}


export function SuccessIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1.8em"
             height="1.8em"
             viewBox="0 0 24 24" { ...props }>
            <g fill="none" stroke="currentColor" stroke-linecap="round"
               stroke-linejoin="round" strokeWidth="2">
                <path
                    d="m6.9 12.087l2.664 2.663a1.009 1.009 0 0 0 1.433 0l5.367-5.368"></path>
                <path d="M12 21.5a9.5 9.5 0 1 0 0-19a9.5 9.5 0 0 0 0 19"></path>
            </g>
        </svg>
    );
}


export function ErrorIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1.8em"
             height="1.8em"
             viewBox="0 0 24 24" { ...props }>
            <path fill="none" stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="2"
                  d="m15.958 8.042l-7.916 7.916m7.916 0L8.042 8.042M12 21.5a9.5 9.5 0 1 0 0-19a9.5 9.5 0 0 0 0 19"></path>
        </svg>
    );
}


export function BrowserIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1.8em"
             height="1.8em"
             viewBox="0 0 24 24" { ...props }>
            <g fill="none" stroke="currentColor" stroke-linecap="round"
               stroke-linejoin="round" stroke-width="2">
                <path d="M12 21.5a9.5 9.5 0 1 0 0-19a9.5 9.5 0 0 0 0 19"></path>
                <path
                    d="M12 21.5c2.332 0 4.222-4.253 4.222-9.5S14.332 2.5 12 2.5c-2.332 0-4.222 4.253-4.222 9.5s1.89 9.5 4.222 9.5M2.5 12h19"></path>
            </g>
        </svg>
    );
}
