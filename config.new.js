module.exports = {
  email: '',
  password: '',
  androidId: '',
  /**
   * In VK the names of some songs consist of Russian letters, which are used as English letters.
   * For example, Russian letter Н (эн) used as an English letter H (aitch) in word "Heart" and etc.
   * If this option is enabled - an application will try to discover such letters and replace them with English letters.
   * But then the application can not find the song whose name is composed exclusively of Russian letters.
   */
  tryConvertToEn: true
};
