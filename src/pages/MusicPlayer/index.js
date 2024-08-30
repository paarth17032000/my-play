import React, { act, useEffect, useMemo, useRef, useState } from "react";
import PlayerLogo from "../../assets/player_logo.svg";
import PlayerProfile from "../../assets/player_profile.png";
import axios from "axios";
import AudioPlayer from "../../components/AudioPlayer";
import { FaSearch } from "react-icons/fa";

const tabs = [
  { id: 1, type: "For You" },
  { id: 2, type: "Top Tracks" },
];

export default function MusicPlayer() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [songListForTabs, setSongListForTabs] = useState([]);
  const [selectedSong, setSelectedSong] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    async function fetchSongs() {
      try {
        setLoading(true);
        const result = await axios.get("https://cms.samespace.com/items/songs");
        const data = result.data.data;
        setSongs(data);
        setSongListForTabs(data);
        setLoading(false);
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

  const handleSongSelect = () => {
    setSelectedSong();
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-black relative  transition-all duration-300 ease-in-out">
      <div
        style={{
          background: `linear-gradient(108.18deg, ${
            selectedSong.accent ?? "#33425E"
          }99 2.46%, #00000099 99.84%)`,
        }}
      >
        <div className="grid grid-cols-12 gap-8 p-8 lg:h-screen min-h-screen">
          <div className="col-span-12 lg:col-span-2 flex flex-row lg:flex-col justify-between">
            <img src={PlayerLogo} alt="player_logo" width={133} height={40} />
            <img
              src={PlayerProfile}
              alt="player_profile"
              className="border-2 border-white/60 rounded-full"
              width={48}
              height={48}
            />
          </div>

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
            <div className="flex items-center justify-between bg-[#FFFFFF14] w-[95%] rounded-[8px] py-2.5 px-4 mt-8">
              <input
                id="search_input"
                type="text"
                name="search"
                onChange={handleSearch}
                value={searchVal}
                placeholder="Search Song/Artist ..."
                className="bg-transparent outline-none text-[18px]"
              />
              <FaSearch color="#FFFFFF50" />
            </div>

            {/* Song List - Scrollable */}
            <div className="my-6 scroll-container lg:h-[calc(100vh-250px)] px-2">
              {" "}
              {/* Dynamic height */}
              {songListForTabs.length > 0 &&
                songListForTabs
                  .filter(
                    (song) =>
                      song.name.toLowerCase().includes(searchVal) ||
                      song.artist.toLowerCase().includes(searchVal)
                  )
                  .map((song) => (
                    <div
                      key={song.cover}
                      onClick={() => setSelectedSong(song)}
                      className={`flex items-center justify-between p-4 cursor-pointer rounded-[8px] my-1 ${
                        selectedSong.id === song.id
                          ? "bg-[#FFFFFF14]"
                          : "hover:bg-[#FFFFFF07]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://cms.samespace.com/assets/${song.cover}`}
                          alt="song_cover"
                          width={48}
                          height={48}
                          className="rounded-full h-12 w-12"
                        />
                        <div className="flex flex-col">
                          <div className="text-white text-[18px]">
                            {song.name}
                          </div>
                          <div className="text-white/60 text-[14px]">
                            {song.artist}
                          </div>
                        </div>
                      </div>
                      {/* <div>4:12</div> */}
                    </div>
                  ))}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 flex flex-col items-center my-2 h-full overflow-hidden">
            {selectedSong.id && (
              <div className="">
                <div className="text-white text-[32px] font-[700] text-left">
                  {selectedSong.name}
                </div>
                <div className="text-white/60 text-[16px]">
                  {selectedSong.artist}
                </div>
                <div className="my-6">
                  <img
                    src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
                    alt="song_cover"
                    width={480}
                    height={480}
                    className="w-[400px] h-[400px] rounded-[8px]"
                  />
                </div>
                <AudioPlayer
                  songList={songs}
                  setSelectedSong={setSelectedSong}
                  selectedSong={selectedSong}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
