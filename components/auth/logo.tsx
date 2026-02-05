import Image from "next/image"

export function AppTogoLogo({ className }: { className?: string }) {
    return (
        <div className={`relative flex flex-col items-center gap-4 ${className}`}>
            <div className="relative w-24 h-24 group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl group-hover:bg-accent/40 transition-colors duration-500 animate-pulse"></div>

                {/* Main Logo Container */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <Image
                        src="/logo.svg"
                        alt="App-Togo Logo"
                        width={96}
                        height={96}
                        className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}
