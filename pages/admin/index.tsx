import React, { useEffect, useState } from "react";
import Head from 'next/head'
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import { default as LocaleLink } from "next/link";

import styles from "./index.module.css";

import Storage from "../../utils/storage"
import { useRouter } from 'next/navigation';
import ProgressBar from "../../components/Admin/Progress";
import StatisticVisits from "../../components/Admin/StatisticVisits";

import StatisticBots from "../../components/Admin/StatisticBots"

import chrome from '../../images/admin/chrome.png'
import firefox from '../../images/admin/firefox.png'
import microsoft from '../../images/admin/microsoft.png'
import opera from '../../images/admin/opera.png'
import safari from '../../images/admin/safari.png'

import android from '../../images/admin/platforms/android.png'
import ipad from '../../images/admin/platforms/ipad.png'
import iphone from '../../images/admin/platforms/iphone.png'
import macbook from '../../images/admin/platforms/macbook.png'
import windows from '../../images/admin/platforms/windows.png'
import windows7 from '../../images/admin/platforms/windows7.png'
import apple from '../../images/admin/platforms/apple.png'
import bot from '../../images/admin/platforms/bot.png'
import yandex from '../../images/admin/yandex.png'

import { StaticImageData } from "next/image";

type Props = {
  // Add custom props here
};

export interface VisitDetail {
  uid: string
  time_entry: string
  browser: string
  os: string
  time_leaving: string
  country: string
  unique: boolean
  ip: string
  utm: string
}

export interface SiteStats {
  top_countries: { [key: string]: number }
  total_visits: number
  unique_visits: number
  total_bots: number
  unique_visits_by_day: { [key: string]: number }
  total_visits_by_day: { [key: string]: number }
  total_visits_bot: { [key: string]: number }
  top_os: any
  top_browsers: { [key: string]: number }
  avg_time_on_site: number
  no_bots: { date: string, details: VisitDetail[], count: number }[],
  bots: { date: string, details: VisitDetail[], count: number }[],
  visits_details_by_days: { date: string, details: VisitDetail[] }[]
}


export interface ProjectsStatData {
  [key: string]: {
    uuid: string
    count: number
    date: string
  }[]
}

interface Data {
  all: number
  projects: {
    count: number
    id: string
    percent: number
    subtitle: string
    title: string
    url: string
    categories: number[]
    byDays: {
      count: number,
      date: string,
      uuid: string
    }[]
  }[]
  unique: {
    by_days: {
      count: number
      date: string
    }[]
    total: number
  },
  visits: {
    by_days: {
      count: number
      date: string
    }[]
    total: number
  },
  countries: {
    count: number
    country: string
  }[],
}


const Admin: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (
  _props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { t } = useTranslation("admin");

  const { push } = useRouter();
  const token = Storage.get("token")


  const headers = new Headers({
    'Authorization': 'Bearer ' + token,
    'Content-Type': "application/json"
  })

  const [statVisits, setStatVisits] = useState("visits")

  const [load, setLoad] = useState(false)

  const [data, setData] = useState({
    all: 0,
    visits: { by_days: [], total: 0 },
    unique: { by_days: [], total: 0 },
    countries: [],
    projects: []
  } as Data)

  const getProjects = async () => {
    try {
      const respProjects = await fetch(`${process.env.NEXT_PUBLIC_BACK_END}/api/projects`, {})
      const jsonProjects = (await respProjects.json()).data

      const respStat = await fetch(`${process.env.NEXT_PUBLIC_BACK_END}/api/stat/projects`, { headers })
      const jsonStat: ProjectsStatData = (await respStat.json()).data


      const projects: any[] = []

      const sumCounts = (jsonData: ProjectsStatData): number => {
        let totalCount = 0;

        for (const key in jsonData) {
          // eslint-disable-next-line no-prototype-builtins
          if (jsonData.hasOwnProperty(key)) {
            const entries = jsonData[key];

            for (const entry of entries) {
              totalCount += entry.count;
            }
          }
        }

        return totalCount;
      }

      const allCount = sumCounts(jsonStat)

      for (let i = 0; i < jsonProjects.length; i++) {
        const elem = jsonProjects[i];
        
        let all = 0
        
        for (let i = 0; i < jsonStat[elem.id].length; i++) {
          const element = jsonStat[elem.id][i];
          all += element.count
        }

          projects.push({ 
            ...elem, 
            count: all, 
            byDays: jsonStat[elem.id],
            percent: (100 / allCount) * all
          })
      }



      setData((prev: any) => ({ ...prev, projects: projects.sort((a, b) => b.count - a.count), all: allCount }))
    } catch (error: any) {
      push(`/admin/auth`)
      Storage.delete("token")
    }
  }

  const [general, setGenerat] = useState({} as SiteStats)

  const init = async () => {
    getProjects()
 
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_END}/api/stat/visits`, { headers })
    const data: SiteStats = (await response.json()).data

    const bots = data.visits_details_by_days.map(day => {
      const details = day.details.filter(item => item.browser.toLowerCase().indexOf("bot") !== -1);
      return {
        details: details,
        date: day.date,
        count: details.length
      }
    });
    const noBots = data.visits_details_by_days.map(
        day => {
          const details = day.details.filter(item => item.browser.toLowerCase().indexOf("bot") == -1);
          return {
            details: details,
            date: day.date,
            count: details.length
        }}
    );

    console.log({...data, no_bots: noBots, bots: bots, top_os: data.top_os})
    setGenerat({...data, no_bots: noBots, bots: bots, top_os: data.top_os})
  }

  useEffect(() => {
    if (!token) {
      push(`/admin/auth`)
    } else {
      init().then(_ => setLoad(true))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [push])

  const langs = [
    { locale: "en", img: "🇺🇸" },
    { locale: "ja", img: "🇯🇵" },
    { locale: "zh", img: "🇨🇳" },
    { locale: "hi", img: "🇮🇳" },
    { locale: "ru", img: "🇷🇺" },
    { locale: "de", img: "🇩🇪" },
    { locale: "fr", img: "🇫🇷" },
    { locale: "es", img: "🇮🇹" },
    { locale: "kk", img: "🇰🇿" },
    { locale: "ko", img: "🇰🇷" },
  ]

  const getBrowserIcon = (key: string): StaticImageData | null => {
    const browsers: { [key: string]: StaticImageData } = {
      "Chrome": chrome,
      "Firefox": firefox,
      "Microsoft": microsoft,
      "Opera": opera,
      "Safari": safari,
      "YaBrowser": yandex
    }

    return browsers[key] ? browsers[key] : null
  }

  const getPlatformIcon = (key: string): StaticImageData | null => {

    if (key.indexOf("Mac") !== -1) return apple

    const platforms: { [key: string]: StaticImageData } = {
      "Android": android,
      "Linux": android,
      "iPad": ipad,
      "iPhone": iphone,
      "Macintosh": macbook,
      "Windows": windows,
      "Windows 10": windows,
      "Windows 7": windows7,
      "Googlebot": bot,
      "AhrefsBot": bot,
      "Vercelbot": bot
    }

    return platforms[key] ? platforms[key] : null
  }

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h, ${minutes}m, ${seconds}s`;
  }

  return (
    load === true ? <div className={styles.main} >
      <Head>
        <title>Admin nik19ta.pro</title>
        <meta name='description' content="Admin nik19ta.pro" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header className={styles.header} >
        <div className={styles.container} >
          <p className={styles.header_title} >ADMIN</p>

          <div className={styles.lang} >
            {langs.map(lang =>
              <LocaleLink 
                key={lang.locale} 
                className={styles.language_switch__item} 
                href="/admin" 
                locale={lang.locale} 
              > 
              {lang.img} 
              </LocaleLink>)}
          </div>
        </div>
      </header>

      <main className={styles.content} >
        <p className={styles.selection_title} >{t("general_site_statistics")}</p>
        <div className={styles.line} >
          <div className={styles.card}>
            <div className={styles.card_count_container} >
              <div className={styles.card_count} >{general.total_visits}</div>
              <div className={styles.card_title} >{t("visits")}</div>
            </div>

            <div className={styles.card_progress} >
              <div className={styles.card_progress__nums} >
                <span className={styles.card_progress__num} >0%</span>
                <span className={styles.card_progress__num} >100%</span>
              </div>

              <div className={styles.card_progress__line} >
                <div style={{ width: 100 / Math.max(general.total_visits, general.unique_visits) * general.total_visits + "%" }} className={styles.card_progress__line_fill} ></div>
              </div>
            </div>
          </div>
          <div className={styles.card} >
            <div className={styles.card_count_container} >
              <div className={styles.card_count} >{general.unique_visits}</div>
              <div className={styles.card_title} >{(t("unique_visits"))}</div>
            </div>

            <div className={styles.card_progress} >
              <div className={styles.card_progress__nums} >
                <span className={styles.card_progress__num} >0%</span>
                <span className={styles.card_progress__num} >100%</span>
              </div>
              <div className={styles.card_progress__line} >
                <div
                  style={{ width: 100 / Math.max(general.total_visits, general.unique_visits) * general.unique_visits + "%" }}
                  className={styles.card_progress__line_fill} />
              </div>
            </div>
          </div>
          <div className={styles.card} >
            <div className={styles.card_count_container} >
              <div className={styles.card_count} >{general.total_bots}</div>
              <div className={styles.card_title} >{t("total_bots")}</div>
            </div>
          </div>
          <div className={styles.card} >
            <div className={styles.card_count_container} >
              <div className={styles.card_count} >{formatDuration(general.avg_time_on_site / 1000000)}</div>
              <div className={styles.card_title} >{t("average_time_spent")}</div>
            </div>
          </div>

          <StatisticVisits 
            setStatVisits={setStatVisits}
            daysObject={statVisits === "unique" ? general.total_visits_by_day : general.unique_visits_by_day} />
        </div>

        <div className={styles.line_flex} >
          <div className={`${styles.card} ${styles.card1}`} >
            {/** Топ стран  */}
            <p className={styles.card_title} >{t("top_countries")}</p>
            <div className={styles.country_container} >
              {general.top_countries ? Object.keys(general.top_countries).map(key =>
                  <div key={key} className={styles.country_line} >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {key !== "-" ? <img className={styles.countryFlag} src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/../icons/${key.toLocaleLowerCase()}.svg`} alt="" /> : <span className={styles.unk} >unk</span>}
                    <span className={styles.country_line_count} >{general.top_countries[key]}</span>
                  </div>
              ) : <></>}
            </div>
          </div>

          <div className={`${styles.card} ${styles.card2}`} >
            <p className={styles.card_title} >{t("top_browsers")}</p>
            <div className={styles.browser_container} >
              {general.top_browsers ? Object.keys(general.top_browsers).map(key =>
                key.toLowerCase().indexOf("bot") === -1 ? <div key={key} className={styles.browser_line} >
                  {getBrowserIcon(key) !== null ? 
                    <Image 
                      className={styles.browser} 
                      width={14}
                      height={14}
                      src={getBrowserIcon(key)!.src} alt="" /> : ""}
                  <span className={styles.browser_line_count} >{key} - {general.top_browsers[key]}</span>
                </div> : <></>
              ) : <></>}
            </div>
          </div>
          <div className={`${styles.card} ${styles.card3}`} >
            <p className={styles.card_title} >{t("top_os")}</p>
            <ul className={styles.browser_container} >
              {general.top_os ? Object.keys(general.top_os).map(key =>
                  key.toLowerCase().indexOf("bot") === -1 ? <li key={key} className={styles.browser_line} >
                    {getPlatformIcon(key) !== null ? 
                      <Image
                        className={styles.browser}
                        width={14}
                        height={14}
                        src={getPlatformIcon(key)!.src} alt="" /> : ""}
                  <span className={styles.platform_line_count} >{key} - {general.top_os[key]}</span>
                </li> : <></>
              ) : <></>}
            </ul>
          </div>

          <div className={`${styles.card} ${styles.card4}`}>
            <StatisticBots daysObject={general.bots} />
          </div>
        </div>

        <p className={styles.selection_title} >{t("projects_statistics")}</p>
        <div className={styles.cards} >
          {data.projects ? data.projects.map((item: any) =>
            <div key={item.id} className={styles.project_card} >
              <picture>
                <source
                  className={styles.project_card_image}
                  type="image/avif"
                  srcSet={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${item.url}@1x.avif 1x, ${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${item.url}@2x.avif 2x`} />
                <source
                  className={styles.project_card_image}
                  type="image/webp"
                  srcSet={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${item.url}@1x.webp 1x, ${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${item.url}@2x.webp 2x`} />
                <img
                  className={styles.project_card_image}
                  src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${item.url}@1x.jpg`}
                  srcSet={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${item.url}@2x.jpg 2x`}
                  alt={`preiew for ${item.title}`} />
              </picture>

              <div className={styles.description} >
                <p>
                  <span className={styles.description_count} >{item.count}</span>
                  <span className={styles.description_subcount} >{item.percent.toFixed(1)}%</span>
                </p>
                <span className={styles.project_title} >{item.title}</span>

                <ProgressBar
                  fs={data.all}
                  sc={item.count}
                  style={{
                    width: "calc(100% + 20px)",
                    marginLeft: "-12px",
                    marginTop: "49px"
                  }} />
              </div>
            </div>) : <></>}
        </div>
      </main>
    </div> : <div></div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { ...(await serverSideTranslations(locale ?? "en", ["admin"])) },
});

export default Admin;
