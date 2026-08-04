export default function AppLogoIcon() {
    return (
        <>
            <img
                src="/assets/logos/icon_white_64.webp"
                className="hidden dark:block"
                alt="LaunchGate Logo"
                width="64"
            />
            <img
                src="/assets/logos/icon_black_64.webp"
                className="black dark:hidden"
                alt="LaunchGate Logo"
                width="64"
            />
        </>
    );
}
