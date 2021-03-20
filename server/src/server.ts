import express, { Request, Response } from "express";
import cors from "cors";
import SpotifyWebApi from "spotify-web-api-node";
import Genius from "genius-lyrics";
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.REDIRECT_URI,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

const geniusLyrics = new Genius.Client(process.env.GENIUS_ACCESS_TOKEN);

interface RequestBody {
  code: string;
  refreshToken: string;
}

app.post("/login", async (req: Request, res: Response) => {
  const { code }: RequestBody = req.body;

  try {
    const { body } = await spotifyApi.authorizationCodeGrant(code);

    res.json({
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      expiresIn: body.expires_in,
    });
  } catch (error) {
    res.status(400);
  }
});

app.post("/refresh", async (req: Request, res: Response) => {
  console.log("hi");
  const { refreshToken }: RequestBody = req.body;
  spotifyApi.setRefreshToken(refreshToken);

  try {
    const { body } = await spotifyApi.refreshAccessToken();

    res.json({ accessToken: body.access_token, expiresIn: body.expires_in });
  } catch (error) {
    res.status(400);
  }
});

app.get("/lyrics", async (req: Request, res: Response) => {
  const { trackTitle, artist } = req.query;

  try {
    const searches = await geniusLyrics.songs.search(`${trackTitle} ${artist}`);
    const lyrics = await searches[0].lyrics();

    res.json(lyrics);
  } catch (error) {
    res.status(400);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
