import { useRouter } from "next/router";
import React from "react";

import styles from "../styles/components/Service.module.css"

interface iServiceItem {
  size: string
  name: string
  sub: string | null
}

interface IService {
  services: {
    ru: iServiceItem[]
    en: iServiceItem[]
  }
}

const Service: React.FC<IService> = ({services}) => {
  const router = useRouter()

  const currentLang = router.locale

  const getCurrentData = (): iServiceItem[] => {
    if (currentLang === "en") return services.en
    else return services.ru
  }

  return (
    <div id="service" className={styles.service_screen} >

      <div className={styles.service_screen__items} >
        {getCurrentData().map(item => (
          <div 
            key={item.name} 
            className={`
              ${styles.service_screen__item} 
              ${item.size === "small" && styles.service_screen__small_item} 
              ${item.size === "large" && styles.service_screen__large_item} 
              ${item.size === "normal" && styles.service_screen__normal_item}`
            } >
            <p className={styles.service_screen__item_title} >
              {item.name}
            </p>
            {item.sub !== null && <p className={styles.service_screen__item_sub_title} >{item.sub}</p>}
          </div>
        ))}
      </div>

      <div className={styles.services_title_container} >
        <div className={styles.services_line} ></div>
        <p className={styles.services_title} >Services</p>
      </div>

    </div>
  )
}

export default Service;