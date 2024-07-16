export const secToTime = (seconds:number) => {
    const hour = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    let time = "";
    if (hour > 0) {
      time += `${hour}:`;
    }
    if (min > 0 || hour > 0) {
      time += `${min < 10 ? "0" + min : min}:`;
    } else {
      time += "0:";
    }
    time += `${sec < 10 ? "0" + sec : sec}`;
    return time;
  };

//   時間の文字列を整数の秒数に変換
  export const convertToSeconds = (createdAt:string): number => {
    const Numbers = createdAt.split(":").map(Number);
    if (Numbers.length === 3) {
      const [hours, minutes, seconds] = Numbers;
      return hours * 3600 + minutes * 60 + seconds;
    } else {
      const [minutes, seconds] = Numbers;
      return minutes * 60 + seconds;
    }
  };