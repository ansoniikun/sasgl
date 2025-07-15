export default function DashboardPage() {
    const menuItems = [
      "Dashboard",
      "Club Members",
      "Capture Scores",
      "Leaderboard",
      "Club Events",
      "Billing",
    ];
  
    const accountItems = ["Edit Club", "Log out"];
  
    const banners = [
      { src: "/banners/itu-wear.png", alt: "ITU GOLF WEAR" },
      { src: "/banners/bmw-cup.png", alt: "BMW Golf Cup" },
      { src: "/banners/swing-cause.png", alt: "Swing for a Cause" },
      { src: "/banners/trusted-champion.png", alt: "Trusted by the Champion" },
      { src: "/banners/better-golf.png", alt: "Better Golf" },
    ];
  
    return (
      <div className="flex min-h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow flex flex-col justify-between">
          <div>
            <div className="p-6">
              <img src="/logo.jpg" alt="Logo" className="w-40 rounded-xl" />
            </div>
            <div className="mt-4 px-4 text-xs text-gray-500">MENU</div>
            <nav className="space-y-1 px-4">
              {menuItems.map((item) => (
                <button
                  key={item}
                  className="flex items-center gap-2  py-2 rounded hover:bg-gray-100 text-left w-full text-sm text-gray-800"
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="mt-4 px-4 text-xs text-gray-500">ACCOUNT PAGES</div>
            <nav className="space-y-1 px-4 mt-1">
              {accountItems.map((item) => (
                <button
                  key={item}
                  className="w-full text-left text-sm py-2 hover:bg-gray-100"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4">
            <button className="cursor-pointer w-full bg-dark-green text-white py-2 text-sm rounded">
              My Personal Dashboard
            </button>
          </div>
        </aside>
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex gap-4 items-center">
              <select className="border px-3 py-1 rounded text-sm">
                <option>Swingers GolfClub</option>
              </select>
              <span className="material-icons text-gray-600">notifications</span>
            </div>
          </header>
  
          {/* Content */}
          <main className="p-6 space-y-6 flex-grow">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow rounded p-4">
                <p className="text-sm text-gray-500">Total Members</p>
                <p className="text-lg font-bold text-dark-green">11 Players</p>
              </div>
              <div className="bg-white shadow rounded p-4">
                <p className="text-sm text-gray-500">Total Events Hosted</p>
                <p className="text-lg font-bold text-dark-green">5 Games</p>
              </div>
            </div>
  
            <div className="grid grid-cols-3 gap-4">
              {banners.map((banner, idx) => (
                <div key={idx} className="rounded overflow-hidden shadow">
                  <img
                    src={banner.src}
                    alt={banner.alt}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </main>
  
          {/* Footer */}
          <footer className="text-center text-xs text-gray-500 py-4 bg-gray-100">
            <div className="flex justify-center gap-6">
              <span>© 2025 Social Golf League</span>
              <a href="#">About Us</a>
              <a href="#">Terms of Use</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Contact Us</a>
            </div>
          </footer>
        </div>
      </div>
    );
  }
  