# Weather-forecast-project

A simple and responsive web application to display current weather conditions and a 5-day forecast for any city, or your current location. Built with HTML, CSS (Tailwind CSS), and JavaScript, consuming the OpenWeatherMap API.

---

## Features

* Current Weather Display: Shows temperature, humidity, wind speed, and weather description for a selected city.
* 5-Day Forecast: Provides a detailed 5-day weather outlook.
* Search by City: Easily search for weather data by typing a city name.
* Current Location Weather: Get weather data for your precise current location (requires browser permission).
* Recent Searches: Remembers your last 5 searches for quick access, displayed as you type.
* Responsive Design: For various screen sizes (desktop, tablet, mobile).

---

##  Setup and Usage

Follow these steps to get the project up and running.


You'll need an API key from OpenWeatherMap to fetch weather data.
1.  Go to [OpenWeatherMap](https://openweathermap.org/api)
2.  Sign up for a free account.
3.  Once logged in, navigate to the "API keys" tab to find or generate your API key.

### Installation

1.  Clone the repository (or download the files):
    ```CMD
    git clone <https://github.com/vishnuadur/Weather-forecast-project>

    ```

2.  Add your OpenWeatherMap API Key:
    * Open the `app.js` file (on src file) in a VS-Code.
    * Find the line `const apiKEY = 'YOUR_API_KEY_HERE';`
    * Replace `'YOUR_API_KEY_HERE'` with the actual API key  obtained from OpenWeatherMap.

    

3.  Tailwind CSS :
    This project uses Tailwind CSS. The `output.css` file is already compiled and included.
    If you want to modify Tailwind classes or recompile the CSS, you'll need Node.js and npm/yarn installed.
    * Install Tailwind CSS locally:
        npx tailwindcss -i ./input.css -o ./output.css --watch
    


---

##  How to Use

1.  Search by City:
    * Type the name of a city into the "Enter city name..." input field.
    * Press `Enter` or click the "Search" button.
2.  Current Location:
    * Click the "Current Location" button.
    * Allow broswer access location .


---

## Technologies Used

* HTML5: Structure of the web page.
* CSS3: Styling, including custom animations.
* Tailwind CSS: CSS framework for rapid UI development.
* JavaScript (ES6+): Dynamic content, API interaction, and user experience.
* OpenWeatherMap API:To fetch weather data and forecasts.
* Font Awesome: For weather icons and other UI icons.
