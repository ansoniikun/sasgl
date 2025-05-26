// app/joinclub/page.js
import DashboardNav from "../components/DashboardNav";
import JoinClub from "../components/JoinClub";

const JoinClubPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <JoinClub />
      </div>
    </div>
  );
};

export default JoinClubPage;
