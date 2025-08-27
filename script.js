const descInput = document.getElementById('descInput');
const bgColorPicker = document.getElementById('bgColorPicker');
const textColorPicker = document.getElementById('textColorPicker');
const avatarUploader = document.getElementById('avatarUploader');
const audioUploader = document.getElementById('audioUploader');
const saveBtn = document.getElementById('saveBtn');
const description = document.getElementById('description');
const avatar = document.getElementById('avatar');
const bgAudio = document.getElementById('bgAudio');

window.onload = () => {
  const config = JSON.parse(localStorage.getItem('customConfig')) || {};
  if (config.description) description.textContent = config.description;
  if (config.bgColor) document.body.style.backgroundColor = config.bgColor;
  if (config.textColor) document.body.style.color = config.textColor;
  if (config.avatar) {
    avatar.src = config.avatar;
    avatar.style.display = 'block';
  }
  if (config.audio) bgAudio.src = config.audio;
};

saveBtn.addEventListener('click', () => {
  const config = {
    description: descInput.value,
    bgColor: bgColorPicker.value,
    textColor: textColorPicker.value
  };

  if (avatarUploader.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      config.avatar = reader.result;
      avatar.src = config.avatar;
      avatar.style.display = 'block';
      localStorage.setItem('customConfig', JSON.stringify(config));
    };
    reader.readAsDataURL(avatarUploader.files[0]);
  }

  if (audioUploader.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      config.audio = reader.result;
      bgAudio.src = config.audio;
      localStorage.setItem('customConfig', JSON.stringify(config));
    };
    reader.readAsDataURL(audioUploader.files[0]);
  }

  description.textContent = config.description;
  document.body.style.backgroundColor = config.bgColor;
  document.body.style.color = config.textColor;

  localStorage.setItem('customConfig', JSON.stringify(config));
});
