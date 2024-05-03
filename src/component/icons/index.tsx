import React, { SVGProps, useEffect, useState } from 'react';

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
            style={{
                width: size,
                height: size,
            }}>
            <div className="bg" aria-hidden>
                {children}
            </div>
            <div className="inner">{children}</div>
        </div>
    );
}

export function ShootEmptyIcon() {
    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 479 479"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M104.781 134.72L374.219 89.8135V142.204L104.781 187.11V134.72ZM104.781 239.501L374.219 194.595V246.985L104.781 291.892V239.501ZM104.781 344.282L374.219 299.376V351.767L104.781 396.673V344.282Z"
                fill="#888888"
                stroke="#888888"
                strokeWidth="29.9375"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
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
        <svg width="512" height="512" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect width="800" height="800" rx="100" fill="#141414" />
            <g filter="url(#filter0_d_238_147)">
                <path d="M399.856 503.925C376.557 527.214 353.165 550.634 329.671 574.175C328.737 575.109 327.953 575.622 326.572 575.622C305.989 575.603 285.874 575.594 266.216 575.594C254.557 575.604 243.608 574.829 233.368 573.279C233.228 573.261 233.172 573.083 233.275 572.981C266.626 539.722 299.782 506.566 332.76 473.513C355.34 450.878 366.756 420.065 362.892 388.048C357.31 341.834 322.315 305.43 276.334 298.223C263.023 296.132 247.939 296.814 234.582 300.417C215.661 305.514 199.512 315.044 186.127 329.017C169.894 345.959 159.029 369.071 157.909 392.762C156.668 419.019 164.303 444.95 180.909 464.917C197.58 484.957 218.928 497.223 244.943 501.722C245.129 501.75 245.213 501.983 245.073 502.123L187.975 559.082C187.714 559.343 187.331 559.408 187.004 559.25C140.556 537.547 105.777 497.027 91.747 447.657C86.9304 430.706 84.7649 412.401 85.2502 392.753C86.2677 351.924 103.947 310.209 131.959 280.572C158.105 252.905 189.59 235.31 226.423 227.796C239.445 225.135 253.474 224.333 267.345 224.379C287.237 224.445 307.044 224.454 326.777 224.398C327.701 224.398 328.579 224.762 329.232 225.415L399.744 296.03C399.921 296.207 400.22 296.207 400.407 296.03L471.32 225.023C471.693 224.641 472.207 224.426 472.748 224.426C493.321 224.407 515.723 224.417 539.955 224.445C549.14 224.454 558.008 225.163 566.549 226.554C566.838 226.601 566.96 226.955 566.745 227.17C536.362 257.554 505.81 288.077 475.1 318.722C467.913 325.9 463.563 330.343 462.051 332.051C422.678 376.809 429.558 444.474 476.043 481.037C497.12 497.615 526.43 506.034 553.229 501.806C583.099 497.101 606.621 482.661 623.787 458.476C647.749 424.732 648.094 379.096 625.757 344.335C609.758 319.431 584.91 303.479 555.609 298.261C555.096 298.177 555.03 297.943 555.394 297.579L612.138 240.901C612.353 240.686 612.689 240.621 612.969 240.752C633.588 250.142 651.94 263.481 668.023 280.768C696.269 311.133 712.165 349.6 714.536 391.007C717.532 443.317 696.353 493.48 658.679 528.325C631.852 553.126 600.489 568.192 564.58 573.503C553.266 575.183 541.477 575.641 528.894 575.622C510.421 575.603 491.855 575.604 473.196 575.613C472.384 575.613 471.693 575.323 471.124 574.754L400.351 503.925C400.211 503.785 399.987 503.785 399.856 503.925Z" fill="white" />
            </g>
            <defs>
                <filter id="filter0_d_238_147" x="80.9809" y="224.377" width="638.038" height="359.651" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="4.20269" />
                    <feGaussianBlur stdDeviation="2.10135" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_238_147" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_238_147" result="shape" />
                </filter>
            </defs>
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
        <div cmdk-motionshot-clipboard-icon="">
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
        <div cmdk-motionshot-hammer-icon="">
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
            <img src={iconUrl} crossOrigin="anonymous"></img>
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

export function ExecuteRecentActionIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            {...props}>
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
            {...props}>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path d="M18.327 7.286h-8.044a1.932 1.932 0 0 0-1.925 1.938v10.088c0 1.07.862 1.938 1.925 1.938h8.044a1.932 1.932 0 0 0 1.925-1.938V9.224c0-1.07-.862-1.938-1.925-1.938"></path>
                <path d="M15.642 7.286V4.688c0-.514-.203-1.007-.564-1.37a1.918 1.918 0 0 0-1.361-.568H5.673c-.51 0-1 .204-1.36.568a1.945 1.945 0 0 0-.565 1.37v10.088c0 .514.203 1.007.564 1.37c.361.364.85.568 1.361.568h2.685"></path>
            </g>
        </svg>
    );
}

export function SoloModeIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            {...props}>
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6.644 15.894a3.894 3.894 0 1 0 0-7.788a3.894 3.894 0 0 0 0 7.788m10.712 0a3.894 3.894 0 1 0 0-7.788a3.894 3.894 0 0 0 0 7.788m-10.712 0h10.712"></path>
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
            {...props}>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path d="M7.375 16.047h9.25m4.625-6.164v7.698a3.083 3.083 0 0 1-3.083 3.083H5.833a3.083 3.083 0 0 1-3.083-3.083V6.419a3.083 3.083 0 0 1 3.083-3.083h3.084a3.083 3.083 0 0 1 2.57 1.377l.873 1.326a1.748 1.748 0 0 0 1.449.77h4.358a3.084 3.084 0 0 1 3.083 3.074"></path>
                <path d="m11.517 4.723l6.927-1.11a1.531 1.531 0 0 1 1.778 1.521v2.457"></path>
            </g>
        </svg>
    );
}

export function ActivatePluginIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            {...props}>
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m6.244 3.114l12.298 8.66A.693.693 0 0 1 18.346 13l-4.62.877a.565.565 0 0 0-.334.82l2.31 4.377a.693.693 0 0 1-.22.981l-1.663.866a.693.693 0 0 1-.935-.289l-2.31-4.387a.577.577 0 0 0-.866-.232L6.325 19.27a.692.692 0 0 1-1.155-.554V3.703a.693.693 0 0 1 1.074-.589"></path>
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
            {...props}>
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
            {...props}>
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

export function DetailPageIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            {...props}>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path d="M14.85 12h-5.7a1.9 1.9 0 0 0-1.9 1.9v2.85c0 1.05.85 1.9 1.9 1.9h5.7a1.9 1.9 0 0 0 1.9-1.9V13.9a1.9 1.9 0 0 0-1.9-1.9M7.668 4.999v1.89m2.85-1.89v1.89m2.85-1.89v1.89"></path>
                <path d="M18.222 6.633v3.135h1.615V17.7a3.866 3.866 0 0 1-3.923 3.8H8.086a3.866 3.866 0 0 1-3.923-3.8V6.3a3.866 3.866 0 0 1 3.923-3.8h7.828a3.866 3.866 0 0 1 3.923 3.8v.333z"></path>
            </g>
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
            {...props}>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path d="M5.47 6.015v12.514a2.72 2.72 0 0 0 2.721 2.721h7.618a2.72 2.72 0 0 0 2.72-2.72V6.014m-15.235.001h17.412"></path>
                <path d="M8.735 6.015V4.382a1.632 1.632 0 0 1 1.633-1.632h3.264a1.632 1.632 0 0 1 1.633 1.632v1.633m-5.984 6.081h5.438m-5.438 4.353h5.438"></path>
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
            {...props}>
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
            {...props}>
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
            {...props}>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path d="M5.833 19.708h12.334a3.083 3.083 0 0 0 3.083-3.083V9.431a3.083 3.083 0 0 0-3.083-3.084h-1.419c-.408 0-.8-.163-1.09-.452l-1.15-1.151a1.542 1.542 0 0 0-1.09-.452h-2.836c-.41 0-.8.163-1.09.452l-1.15 1.151c-.29.29-.682.452-1.09.452H5.833A3.083 3.083 0 0 0 2.75 9.431v7.194a3.083 3.083 0 0 0 3.083 3.083"></path>
                <path d="M12 16.625a4.111 4.111 0 1 0 0-8.222a4.111 4.111 0 0 0 0 8.222"></path>
            </g>
        </svg>
    );
}

export function SuccessIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            {...props}>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path d="m6.9 12.087l2.664 2.663a1.009 1.009 0 0 0 1.433 0l5.367-5.368"></path>
                <path d="M12 21.5a9.5 9.5 0 1 0 0-19a9.5 9.5 0 0 0 0 19"></path>
            </g>
        </svg>
    );
}

export function ErrorIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.8em"
            height="1.8em"
            viewBox="0 0 24 24"
            {...props}>
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m15.958 8.042l-7.916 7.916m7.916 0L8.042 8.042M12 21.5a9.5 9.5 0 1 0 0-19a9.5 9.5 0 0 0 0 19"></path>
        </svg>
    );
}


export function NotFoundIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 16 16" {...props} ><path fill="currentColor" d="M3.5 2A2.5 2.5 0 0 0 1 4.5V6h4.586a.5.5 0 0 0 .353-.146L8 3.793L6.646 2.439A1.5 1.5 0 0 0 5.586 2zM1 11.5V7h4.586a1.5 1.5 0 0 0 1.06-.44L9.207 4H12.5A2.5 2.5 0 0 1 15 6.5V10h-.027a4.5 4.5 0 1 0-7.302 4H3.5A2.5 2.5 0 0 1 1 11.5m9.5 2.5c.786 0 1.512-.26 2.096-.697l2.55 2.55a.5.5 0 1 0 .708-.707l-2.55-2.55A3.5 3.5 0 1 0 10.5 14m0-1a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5"></path></svg>
    );
}

export function GlobeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24">
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m2 0a8 8 0 1 0 16 0a8 8 0 0 0-16 0m4.252-1.552c.243-.508.643-1.948.932-1.948c.288 0 .183.723.441.786c.217.053.05-.323.653-.39s1.26.302 1.26.302s.712.177 1.369 0c0 0-.347-.526.078-.698c.424-.172 1.002.464 1.023.875c.021.411-.944.687-.944.687l.944.567s.277-.878.867-.887c.525-.01 1.183.95.875 1.383c-.308.433-.506.135-.506.135s-.94.952-1.236 1.123c-.295.17-.708 0-.708 0s-.175.324 0 .473c.355.366 1.277.73 1.277.73s2.835.461 2.923 1.039c.088.578-2.256 3.5-2.625 3.5H14c-.357-.63.577-2.644.577-2.644s-.48-.532-.577-.856c-.096-.324.186-.894.186-.894l-1.279-.589s-.68 0-1.017-.267c-.337-.267-.515-1.75-.515-1.75l-1.22-.894s-1.06 1.346-1.405 1.174c-.346-.172-.74-.45-.498-.957m6.57-2.098c-.844 0-2.875-1.074-2.534-1.65c0-.826 2.135-.702 2.593-.702c.458 0 1.58.354 2.203.85c.623.495-.263 1.203-.572 1.502c-.31.3-.845 0-1.69 0"
            />
        </svg>
    );
}

export function StoreIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            {...props}>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path d="M12 21.5a9.5 9.5 0 1 0 0-19a9.5 9.5 0 0 0 0 19"></path>
                <path d="m7.778 16.222l1.942-5.837a1.056 1.056 0 0 1 .675-.665l5.827-1.942l-1.942 5.837a1.055 1.055 0 0 1-.665.665z"></path>
            </g>
        </svg>
    );
}

export function GoogleStoreIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
            {...props}>
            <path
                fill="#FFF"
                d="M128.003 199.216c39.335 0 71.221-31.888 71.221-71.223c0-39.335-31.886-71.223-71.221-71.223c-39.335 0-71.222 31.888-71.222 71.223c0 39.335 31.887 71.223 71.222 71.223"></path>
            <path
                fill="#229342"
                d="M35.89 92.997c-5.313-9.203-11.558-18.862-18.736-28.977a127.98 127.98 0 0 0 110.857 191.981c11.78-16.523 19.78-28.437 23.996-35.74c8.099-14.028 18.573-34.112 31.423-60.251v-.015a63.993 63.993 0 0 1-110.857.017c-17.453-32.548-29.68-54.887-36.683-67.015"></path>
            <path
                fill="#FBC116"
                d="M128.008 255.996A127.972 127.972 0 0 0 256 127.997A127.983 127.983 0 0 0 238.837 64c-24.248-2.39-42.143-3.585-53.686-3.585c-13.088 0-32.139 1.195-57.152 3.585l-.014.01a63.993 63.993 0 0 1 55.444 31.987a63.993 63.993 0 0 1-.001 64.01z"></path>
            <path
                fill="#1A73E8"
                d="M128.003 178.677c27.984 0 50.669-22.685 50.669-50.67c0-27.986-22.685-50.67-50.67-50.67c-27.983 0-50.669 22.686-50.669 50.67s22.686 50.67 50.67 50.67"></path>
            <path
                fill="#E33B2E"
                d="M128.003 64.004H238.84a127.973 127.973 0 0 0-221.685.015l55.419 95.99l.015.008a63.993 63.993 0 0 1 55.415-96.014z"></path>
        </svg>
    );
}

export function BackIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className=""
            {...props}>
            <rect
                id="r4"
                x={0}
                y={0}
                rx={128}
                width={512}
                height={512}
                fill="#D1D1D1"
                strokeWidth={0}
                strokeOpacity="100%"
                paintOrder="stroke"
            />
            <clipPath id="clip">
                <use xlinkHref="#r4" />
            </clipPath>
            <defs>
                <radialGradient
                    id="r6"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(256) rotate(90) scale(512)">
                    <stop stopColor="white" />
                    <stop offset={1} stopColor="#141414" stopOpacity={0} />
                </radialGradient>
            </defs>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 16"
                width={352}
                height={352}
                x={80}
                y={80}
                alignmentBaseline="middle"
                style={{ color: '#141414' }}>
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6.25 4.75 2.75 8m0 0 3.5 3.25M2.75 8h10.5"
                />
            </svg>
        </svg>
    );
}
