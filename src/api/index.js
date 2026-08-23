// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );
  const data = await res.json();

  if (data[0].url.startsWith("@")) {
    // eslint-disable-next-line no-unused-vars
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: v.url,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  const res = await fetch("https://v1.hitokoto.cn");
  return await res.json();
};

/**
 * 天气
 */

// 获取和风天气城市ID（支持城市名或经纬度）
export const getCityLookup = async (key, location) => {
  const locationParam = location ? `&location=${encodeURIComponent(location)}` : "";
  const res = await fetch(`https://geoapi.qweather.com/v2/city/lookup?key=${key}${locationParam}`);
  return await res.json();
};

// 获取和风天气实时天气
export const getWeatherNow = async (key, location) => {
  const res = await fetch(
    `https://devapi.qweather.com/v7/weather/now?location=${location}&key=${key}`,
  );
  return await res.json();
};

// 获取备用天气 API（使用心知 Seniverse）
// 修改：先通过 IP 获取城市（使用 https://ipapi.co/json/），再用该城市请求心知实时天气，最终映射为原教书先生 API 的结构以兼容现有组件。
// 使用说明：请在项目环境（.env）中设置 VITE_SENIVERSE_KEY，不要将私钥提交到公共仓库。
export const getOtherWeather = async () => {
  const key = import.meta.env.VITE_SENIVERSE_KEY;
  let location = import.meta.env.VITE_SENIVERSE_LOCATION || ""; // 若未设置，则使用 IP 自动检测

  if (!key) {
    throw new Error("请在 .env 中设置 VITE_SENIVERSE_KEY（不要把私钥泄露到公共仓库）");
  }

  // 使用 IP 定位（优先使用 VITE_SENIVERSE_LOCATION，如未配置则调用 ipapi）
  let usedLocation = import.meta.env.VITE_SENIVERSE_LOCATION || "";

  if (!usedLocation) {
    try {
      // 改用支持 CORS 的 ipwho.is 服务（无需 key）
      const ipRes = await fetch("https://ipwho.is/");
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        const ipCity = ipData.city || ipData.region || ipData.country;
        if (ipCity) {
          usedLocation = ipCity;
        }
      }
    } catch (err) {
      console.warn('IP 地理定位失败（ipwho.is），使用默认位置：', err);
    }
  }

  if (!usedLocation) {
    usedLocation = 'beijing';
  }

  const url = `https://api.seniverse.com/v3/weather/now.json?key=${encodeURIComponent(key)}&location=${encodeURIComponent(usedLocation)}&language=zh-Hans&unit=c`;
  console.log('[getOtherWeather] using location (IP-based):', usedLocation, 'request url:', url);
  const res = await fetch(url);
  const data = await res.json();

  // 将心知返回的数据映射为原来教书先生 API 的字段以兼容 Weather.vue
  const r = data && data.results ? data.results[0] : null;
  if (!r) {
    return {
      result: {
        city: { City: location },
        condition: {
          day_weather: null,
          min_degree: null,
          max_degree: null,
          day_wind_direction: null,
          day_wind_power: null,
        },
      },
    };
  }

  // 准备友好的默认值以避免在页面显示 "null"
  const weatherText = r.now && (r.now.text || r.now.description) || '暂无';
  const temp = r.now && (r.now.temperature || r.now.temp) || null;
  // 风向：如果没有数据，显示"无风"
  const windDir = r.now && r.now.wind_direction ? r.now.wind_direction : '无风';
  // 风力等级：如果没有数据，显示"0"
  const windPower = r.now && r.now.wind_scale !== undefined && r.now.wind_scale !== null && r.now.wind_scale !== ''
    ? r.now.wind_scale
    : '0';

  return {
    result: {
      city: { City: r.location && (r.location.name || r.location.path || location) || location },
      condition: {
        day_weather: weatherText,
        // 心知 now 接口仅返回单个实时温度，映射到 min/max
        min_degree: temp,
        max_degree: temp,
        day_wind_direction: windDir,
        day_wind_power: windPower,
      },
    },
  };
};