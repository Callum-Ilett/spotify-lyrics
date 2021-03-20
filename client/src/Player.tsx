import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

interface Props {
  accessToken: string;
  trackUri: string | undefined;
}

export default function Player({ accessToken, trackUri }: Props) {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />
  );
}
