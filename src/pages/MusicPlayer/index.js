import React, { useEffect, useState } from "react";
import axios from "axios";
import AudioPlayer from "../../components/AudioPlayer";
import InputSearch from "../../components/InputSearch";
import SongListComponent from "../../components/SongListComponent";
import SkeletonLoaderComponent from "../../components/SkeletonLoader";
import PlayerProfile from "../../assets/player_profile.png";
import PlayerLogo from "../../assets/player_logo.svg";
import { IoClose } from "react-icons/io5";
import { MdMusicNote } from "react-icons/md";

const tabs = [
  { id: 1, type: "For You" },
  { id: 2, type: "Top Tracks" },
];

export default function MusicPlayer() {
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSongsList, setShowSongsList] = useState(false);
  const [selectedSong, setSelectedSong] = useState({});
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [songs, setSongs] = useState([]);
  const [songListForTabs, setSongListForTabs] = useState([]);

  useEffect(() => {
    // fetching data and error handling
    async function fetchSongs() {
      try {
        setLoading(true);
        const result = await axios.get("https://cms.samespace.com/items/songs");
        const data = result.data.data;
        // added this to show loading state for extra 1.5secs 
        setTimeout(() => {
          setSongs(data);
          setSongListForTabs(data);
          setLoading(false);
        }, 1500)
        
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchSongs();
  }, []);

  const handleTabSwitch = (tab) => {
    if (tab.type === "Top Tracks") {
      let forYouSongs = songs.filter((song) => song.top_track === true);
      setSongListForTabs(forYouSongs);
    } else {
      setSongListForTabs(songs);
    }
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchVal(e.target.value.toLowerCase());
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setShowSongsList(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-black relative  transition-all duration-300 ease-in-out">
      {/* dynamically set Bg color */}
      <div
        style={{
          background: `linear-gradient(108.18deg, ${
            selectedSong.accent ?? "#33425E"
          }99 2.46%, #00000099 99.84%)`,
        }}
      >
        {/* sidebar at desktop view and navbar at mobile view */}
        <div className="grid grid-cols-12 md:gap-8 gap-4 md:p-8 p-5 lg:h-screen min-h-screen">
          <div className="col-span-12 lg:col-span-2 flex flex-row lg:flex-col justify-between md:h-auto h-[48px]">
            <img src={PlayerLogo} alt="player_logo" width={133} height={40} />
            <img
              src={PlayerProfile}
              alt="player_profile"
              className="border-2 border-white/60 rounded-full h-12 w-12"
              width={48}
              height={48}
            />
          </div>

          {/* song list section comprise of Tabs, Search and SongsList */}
          <div className="hidden md:block md:col-span-6 lg:col-span-4 py-1.5 px-4 h-full">
            {/* Tabs */}
            <div className="flex gap-10 text-[24px] font-[700] cursor-pointer">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab)}
                  className={
                    activeTab.id === tab.id
                      ? "text-[#FFFFFF]"
                      : "text-[#FFFFFF50]  hover:text-white"
                  }
                >
                  {tab.type}
                </div>
              ))}
            </div>

            {/* Search */}
            <InputSearch searchVal={searchVal} handleSearch={handleSearch} />

            {/* Song List - Scrollable */}
            <div className="my-6 scroll-container lg:h-[calc(100vh-250px)] px-2">
              {/* loader for songlists */}
              {loading ? (
                <SkeletonLoaderComponent />
              ) : (
                <>
                  {songListForTabs.length > 0 && (
                    <SongListComponent
                      searchVal={searchVal}
                      songListForTabs={songListForTabs}
                      selectedSong={selectedSong}
                      handleSongSelect={handleSongSelect}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 flex flex-col items-center md:my-2 my-0 h-full overflow-hidden">
            {selectedSong.id ? (
              <div>
                {/* handling all audio relation stuff here */}
                <AudioPlayer
                  songList={songs}
                  setSelectedSong={setSelectedSong}
                  selectedSong={selectedSong}
                  setShowSongsList={setShowSongsList}
                />
              </div>
            ) : (
              // placeholder for time when no song is selected
              <div className="flex flex-col items-center justify-center md:h-full">
                <div
                  onClick={() => setShowSongsList(true)}
                  className="md:cursor-not-allowed md:pointer-events-none cursor-pointer"
                >
                  <MdMusicNote className="text-white/70 w-[400px] h-[400px] rounded-[8px]" />
                </div>
                <div className="hidden md:block text-white/80 text-[32px] font-[700]">
                  Select a song to play music
                </div>
                <div className="md:hidden block text-white/80 text-[32px] font-[700] text-center">
                  Click music icon to open song menu
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* overlay for mobile screen */}
      <div
        className={`fixed top-0 right-0 h-screen w-full bg-black/90 bg-opacity-90 transform transition-transform duration-300 ease-in-out ${
          showSongsList ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setShowSongsList(false)}
          className="absolute top-4 right-4 text-white text-xl"
        >
          <IoClose size={30} />
        </button>

        {/* Menu content for mbile view */}
        <div className="flex flex-col items-center justify-center h-full">
          {/* Tabs */}
          <div className="flex gap-10 text-[24px] font-[700] cursor-pointer">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => handleTabSwitch(tab)}
                className={
                  activeTab.id === tab.id
                    ? "text-[#FFFFFF]"
                    : "text-[#FFFFFF50]  hover:text-white"
                }
              >
                {tab.type}
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="w-fit">
            <InputSearch searchVal={searchVal} handleSearch={handleSearch} />
          </div>

          {/* Song List - Scrollable */}
          <div className="my-6 scroll-container lg:h-[calc(100vh-250px)] px-2">
            {songListForTabs.length > 0 && (
              <SongListComponent
                searchVal={searchVal}
                songListForTabs={songListForTabs}
                selectedSong={selectedSong}
                handleSongSelect={handleSongSelect}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
