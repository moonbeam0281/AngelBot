import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import VeilBackground from "../components/landing/VeilBackground.jsx";
import angelBotImage from "../assets/angelbot.png";
import { useStyles } from "../context/StyleContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";


export default function Landing() {
  const { isAuth, user, startDiscordLogin } = useAuth();
  const { styles, getGradientText, getButton } = useStyles();
  const { theme } = useTheme();

  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuth) {
      navigate("/dashboard");
    } else {
      startDiscordLogin();
    }
  };

  return (
    <div className={`${styles.landing.heroWrapper} select-none`}>
      {
        theme == "dark" ?
          <VeilBackground
            hueShift={200}
            scanlineIntensity={-2.5}
            scanlineFrequency={0}
            speed={1.6}
            warpAmount={5}
            resolutionScale={1.5}
          />
          :
          <VeilBackground
            hueShift={25}
            scanlineIntensity={-35}
            scanlineFrequency={0}
            speed={1.6}
            warpAmount={5}
            resolutionScale={1.5}
          />
      }

      <div className="relative z10 max-w-3xl justify-center">

        <div className={`${styles.landingLogo.wrapper} mb-10`}>
          <div className={styles.landingLogo.auraColor} />
          <div className={styles.landingLogo.auraWhite} />

          <div className={`${styles.landingLogo.avatarContainer}${styles.landingLogo.sizes.lg}`}>
            <img src={angelBotImage} alt={"AngelBot"} className="h-full w-full object-cover" />
          </div>
        </div>

        <h1 className={getGradientText("title", "text-5xl sm:text-6xl font-extrabold font-display mb-10 -tracking-[-15px]")}>
          ANGELBOT
        </h1>

        <p className={styles.text.base + " mb-15 font-semibold"}>
          Your celestial Discord companion — keeping your servers safe, cozy, and just a little bit magical.
        </p>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-4">
          <h2 className={styles.text.soft}>
            {isAuth
              ? <>Welcome back <span className="font-bold">{user?.username}</span></>
              : `We’ll send you to Discord for a quick, safe login.`}
          </h2>

          <button
            onClick={handleClick}
            className={getButton("landing")}
          >
            {isAuth ? "💠 Open Dashboard" : "💠 Login with Discord"}
          </button>
        </div>
      </div>
    </div>
  );
}
