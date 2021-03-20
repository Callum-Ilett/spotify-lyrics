import { Container } from "react-bootstrap";

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
];

const params = {
  client_id: "71fcc9fe6e064a7287c95f31f5b01aed",
  response_type: "code",
  redirect_uri: "http://localhost:3000",
  scope: scopes.join(" "),
};

const BASE_URL = "https://accounts.spotify.com/authorize?";

const queryString = new URLSearchParams(params).toString();

const AUTH_URL = BASE_URL + queryString;

interface Props {}

const Login = (props: Props) => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a href={AUTH_URL} className="btn btn-success btn-lg">
        Login with Spotify
      </a>
    </Container>
  );
};

export default Login;
