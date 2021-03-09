import Head from 'next/head'
import { useContext } from 'react'
import { Profile } from '../components/Profile'
import { ChallengesContext } from '../contexts/ChallengesContext'
import styles from '../styles/pages/Ranking.module.css'

export interface RankingProps {}

//import leaderboard from '../../leaderboard.test.json'

export default function Ranking() {
  const { leaderboard } = useContext(ChallengesContext)

  return (
    <div className={styles.rankingContainer}>
      <Head>
        <title>Ranking | move.it</title>
      </Head>

      <div>
        <h1>Leaderboard</h1>
        
        { leaderboard && leaderboard.length>0 && (
          <table
          cellSpacing="0"
          cellPadding="0"
          >
          <thead>
            <tr>
              <th>POSIÇÃO</th>

              <th 
                className={styles.rankingProfile}
                style={{width: '60%'}}
                >
                <span>
                  USUÁRIO
                </span>
              </th>

              <th
                style={{
                  width: '20%',
                }}
                >
                DESAFIOS
              </th>

              <th
                style={{
                  width: '20%',
                }}
              >
                EXPERIÊNCIA
              </th>
            </tr>
          </thead>

          <tbody>
            {
              leaderboard && leaderboard.length>0 && 
              leaderboard.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      {index+1}
                    </div>
                  </td>

                  <td className={styles.rankingProfile}>
                    <div>
                      <Profile 
                        name={item.name} 
                        avatarUrl={item.avatarUrl}
                        level={item.score.level}
                        />
                    </div>
                  </td>

                  <td>
                    <div>
                      <strong>{item.score.challengesCompleted}</strong>
                      completados
                    </div>
                  </td>

                  <td>
                    <div>
                      <strong>{item.score.currentExperience}</strong>
                      xp
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        )}
     </div>
    </div>
  )
}