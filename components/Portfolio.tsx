import React, { useEffect, useState } from "react"

import styles from "../styles/components/Portfolio.module.css"

import { portfolioData } from "../utils/portfolio"
import { useTranslation } from 'next-i18next'
import useWindowSize from "../hooks/useWindowsSize"
import Link from "next/link"

import Image from 'next/image'

const Portfolio: React.FC = () => {
  const { t } = useTranslation('common')
  
  const [activeTab, setActiveTab] = useState(-1)

  const [width]: number[] = useWindowSize();

  const portfolio = portfolioData
  const categories = [
    { id: 1, title: t("portfolio.all_projects") },
    { id: 2, title: "WEB" },
    { id: 4, title: "MOBILE" },
    { id: 3, title: "BOT" },
  ]

  const [limit, setLimit] = useState(4)


  useEffect(() => {
    setActiveTab(1)
    if (localStorage.limit) {
      setLimit(+localStorage.limit)
    }
  }, [])

  
  const getProjects = (limit: number) => {
    return portfolio
      .filter(item => item.categories.includes(activeTab) || activeTab === 1)
      .filter((item, index) => index < limit)
  }

  return (
    <div id="portfolio" className={styles.portfolio_screen}>
      <div className={styles.portfolio_screen__title_container}>
        <h2 className={styles.portfolio_screen__title}>Portfolio</h2>
      </div>

      <div className={styles.portfolio_screen__tabs}>
        {categories.map((item) => (
          <div key={item.id} onClick={() => {
            setActiveTab(item.id)
            setLimit(4)
          }}
            className={`${styles.portfolio_screen__tabs_item} ${item.id === activeTab && styles.tabs_item_active}`} >
            {item.title}
          </div>
        ))}
      </div>
      
      <div className={styles.portfolio_cards} >
        {getProjects(limit).map((element) => <div 
            key={element.id} 
            className={styles.portfolio_cards__item} >
              
              <Link href={`/project/${element.id}`} >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${element.url}`}
                  className={styles.portfolio_cards__item_photo} 
                  alt={`preiew for ${element.title}`} />

                <p className={styles.portfolio_cards__item_title}>{element.title}</p>
                <p className={styles.portfolio_cards__item_subtitle}> {element.sub_title} </p>
              </Link>
            </div>
        )}
      </div>

      <div className={styles.portfolio_screen__show_more_container}>

        {getProjects(limit).length > 3 && limit === 4 && <button 
          className={styles.portfolio_screen__show_more} 
          onClick={() => { 
            localStorage.limit = 10;
            setLimit(10)
            }} > 
          {t('portfolio.show_more')} 
        </button>}

        {limit > 4 && <button 
          className={styles.portfolio_screen__show_more} 
          onClick={() => { 
            localStorage.limit = 4;
            setLimit(4)
            }} > 
          {t('portfolio.show_less')}
        </button>}

      </div>
    </div>
  );
}

export default Portfolio;