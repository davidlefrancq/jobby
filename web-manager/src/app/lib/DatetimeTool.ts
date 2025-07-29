export default class DatetimeTool {
    /**
   * FR: Formate la durée en HH:MM:SS
   * EN: Formats the duration into HH:MM:SS
   */
  public static formatDuration(totalSeconds: number): string {
    // FR: Définir les durées en secondes pour chaque unité de temps
    // EN: Define the durations in seconds for each time unit
    const secondsInHour = 3600;
    const secondsInMinute = 60;

    let remainingSeconds = totalSeconds;

    // FR: Calculer les heures, minutes et secondes restantes
    // EN: Calculate the remaining hours, minutes, and seconds
    const hours = Math.floor(remainingSeconds / secondsInHour);
    remainingSeconds %= secondsInHour;
    const minutes = Math.floor(remainingSeconds / secondsInMinute);
    const seconds = Math.floor(remainingSeconds % secondsInMinute);

    // FR: Formater les heures, minutes et secondes en HH:MM:SS
    // EN: Format the hours, minutes, and seconds into HH:MM:SS
    const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // FR: Retourner la chaîne formatée
    // EN: Return the formatted string
    return timeString;
  }
}