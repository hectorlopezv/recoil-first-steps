import { atom, useRecoilState, useRecoilValue } from "recoil";

//Atoms
const darkModeAtom = atom({
  key: "darkMode",
  default: false,
});

const DarkModeSwith = () => {
  const [darkMode, setdarkMode] = useRecoilState(darkModeAtom);
  return (
    <input
      type="checkbox"
      checked={darkMode}
      onChange={(e) => setdarkMode(e.currentTarget.checked)}
    />
  );
};
const Button = () => {
  const darkMode = useRecoilValue(darkModeAtom);

  return (
    <button
      style={{
        backgroundColor: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }}
    >
      MY UI Button
    </button>
  );
};
export const Atoms = () => {
  return (
    <div>
      <div>
        <DarkModeSwith />
      </div>

      <div>
        <Button />
      </div>
    </div>
  );
};
