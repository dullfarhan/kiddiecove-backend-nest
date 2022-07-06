function getDate() {
  const today = new Date();
  // const monthNames: string[] = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  //   'August',
  //   'September',
  //   'October',
  //   'November',
  //   'December',
  // ];
  //   const mm = monthNames[today.getMonth()] // January is 0!
  const dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
  const mm = today.getMonth() < 10 ? '0' + today.getMonth() : today.getMonth();
  const yyyy = today.getFullYear();

  //   today = mm + ', ' + dd + ' ' + yyyy
  const todayStr: string = dd + '-' + mm + '-' + yyyy;

  return todayStr;
}

function getTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  let hStr: string;
  let mStr: string;
  //   let nowStr: string;

  if (h < 10) {
    hStr = '0' + h;
  }

  if (m < 10) {
    mStr = '0' + m;
  }

  const nowStr = hStr + ':' + mStr;
  return nowStr;
}
const dateTimeHelper = {
  getDate,
  getTime,
};
export default dateTimeHelper;
