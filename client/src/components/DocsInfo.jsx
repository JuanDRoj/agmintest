import "../styles/MapStyles.css";

const DocsInfo = ({}) => {
  const docLink =
    "https://www.dropbox.com/scl/fi/4r8t937rks6lbslkcz4mi/ADMISION-AGMIN.pdf?rlkey=j8n7ek7kdfjtbwrpuolsvom8y&st=2zjzjq73&dl=0"; // Also visible in code

  return (
    <div id="docs">
      <h3>Documentation</h3>
      <a href={docLink} target="_blank" rel="noopener noreferrer">
        Open Documentation
      </a>
    </div>
  );
};

export default DocsInfo;
