<template>
  <div class="weather" v-if="weatherData.adCode.city && weatherData.weather.weather">
    <span>{{ weatherData.adCode.city }}&nbsp;</span>
    <span>{{ weatherData.weather.weather }}&nbsp;</span>
    <span>{{ weatherData.weather.temperature }}℃</span>
    <span class="sm-hidden">
      &nbsp;{{
        weatherData.weather.winddirection?.endsWith("风")
          ? weatherData.weather.winddirection
          : weatherData.weather.winddirection + "风"
      }}&nbsp;
    </span>
    <span class="sm-hidden">{{ weatherData.weather.windpower }}&nbsp;级</span>
  </div>
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup>
import { getCityLookup, getWeatherNow, getOtherWeather } from "@/api";
import { Error } from "@icon-park/vue-next";

// 和风天气 Key（优先读 .env，否则使用默认值）
const mainKey = import.meta.env.VITE_WEATHER_KEY || "b939f1d7cdb14d789cf5e11ec75b9dbd";
// 和风天气默认城市ID（北京）
const defaultLocation = import.meta.env.VITE_WEATHER_LOCATION || "101010100";
// 城市名称
const cityName = import.meta.env.VITE_WEATHER_CITY_NAME || "北京";

// 天气数据
const weatherData = reactive({
  adCode: {
    city: null, // 城市
    adcode: null, // 城市编码
  },
  weather: {
    weather: null, // 天气现象
    temperature: null, // 实时气温
    winddirection: null, // 风向描述
    windpower: null, // 风力级别
  },
});

// 取出天气平均值
const getTemperature = (min, max) => {
  try {
    // 计算平均值并四舍五入
    const average = (Number(min) + Number(max)) / 2;
    return Math.round(average);
  } catch (error) {
    console.error("计算温度出现错误：", error);
    return "NaN";
  }
};

// 获取天气数据
const getWeatherData = async () => {
  try {
    // 获取地理位置信息
    if (!mainKey) {
      console.log("未配置，使用备用天气接口");
      const result = await getOtherWeather();
      console.log(result);
      const data = result.result;
      weatherData.adCode = {
        city: data.city.City || "未知地区",
        // adcode: data.city.cityId,
      };
      weatherData.weather = {
        weather: data.condition.day_weather,
        temperature: getTemperature(data.condition.min_degree, data.condition.max_degree),
        winddirection: data.condition.day_wind_direction,
        windpower: data.condition.day_wind_power,
      };
    } else {
      // 通过 IP 定位获取用户所在城市
      let locationId = defaultLocation;
      let userCity = cityName;

      try {
        // 1. 获取用户 IP 和城市信息
        const ipRes = await fetch("https://ipwho.is/");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          console.log("IP定位结果:", ipData);

          // 直接使用 ipwho.is 返回的城市名
          if (ipData.city) {
            userCity = ipData.city;
          }

          // 如果有经纬度，尝试通过和风天气 API 获取更准确的城市信息
          const longitude = ipData.longitude;
          const latitude = ipData.latitude;

          if (longitude && latitude) {
            try {
              const locationStr = `${longitude},${latitude}`;
              const cityLookup = await getCityLookup(mainKey, locationStr);
              console.log("城市查询结果:", cityLookup);

              if (cityLookup.code === "200" && cityLookup.location && cityLookup.location.length > 0) {
                const cityInfo = cityLookup.location[0];
                locationId = cityInfo.id;
                // 优先使用中文城市名
                userCity = cityInfo.adm2 || cityInfo.adm1 || cityInfo.name || userCity;
              }
            } catch (lookupErr) {
              console.warn("城市查询失败，使用IP定位的城市名:", lookupErr);
            }
          }
        }
      } catch (err) {
        console.warn("IP 定位失败，使用默认城市:", err);
      }

      console.log("最终城市信息:", { userCity, locationId });

      // 2. 使用城市 ID 查询天气
      const result = await getWeatherNow(mainKey, locationId);
      console.log("和风天气返回:", result);
      if (result.code !== "200") {
        throw "天气查询失败";
      }
      const now = result.now;
      weatherData.adCode = {
        city: userCity,
        adcode: locationId,
      };
      weatherData.weather = {
        weather: now.text,
        temperature: now.temp,
        winddirection: now.windDir,
        windpower: now.windScale,
      };
    }
  } catch (error) {
    console.error("天气信息获取失败:" + error);
    onError("天气信息获取失败");
  }
};

// 报错信息
const onError = (message) => {
  ElMessage({
    message,
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  console.error(message);
};

onMounted(() => {
  // 调用获取天气
  getWeatherData();
});
</script>
