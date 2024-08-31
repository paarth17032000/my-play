import React from "react";

export default function SongListComponent({
  songListForTabs,
  searchVal,
  selectedSong,
  handleSongSelect,
}) {
  return (
    <div className="grid md:grid-cols-1 grid-cols-2 md:gap-0 gap-5">
      {songListForTabs
        .filter(
          (song) =>
            song.name.toLowerCase().includes(searchVal) ||
            song.artist.toLowerCase().includes(searchVal)
        )
        .map((song) => (
          <div
            key={song.cover}
            onClick={() => handleSongSelect(song)}
            className={`flex items-center col-span-1 justify-between p-4 cursor-pointer rounded-[8px] my-1 ${
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
                <div className="text-white text-[18px]">{song.name}</div>
                <div className="text-white/60 text-[14px]">{song.artist}</div>
              </div>
            </div>
            {/* <div>4:12</div> */}
          </div>
        ))}
    </div>
  );
}
