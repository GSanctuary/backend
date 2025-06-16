type Location = {
  name: string;
  country: string;
  lat: number;
  lon: number;
};

export type CurrentWeather = {
  location: Location;
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    feelslike_c: number;
    feelslike_f: number;
  };
};
