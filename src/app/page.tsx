import Image from 'next/image'
import Board from '@/components/Board'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Board player1='x' player2='o' rowInput={3} colInput={3} rangeInput={3} />
    </main>
  )
}
