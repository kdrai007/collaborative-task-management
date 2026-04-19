import BoardColumn from './BoardColumn';
import TaskCard from './TaskCard';

export default function Board() {
  return (
    <section className="flex-1 px-10 pb-10 overflow-x-auto no-scrollbar">
      <div className="flex gap-8 h-full min-w-[1200px]">
        {/* To Do Column */}
        <BoardColumn
          title="To Do"
          count={3}
          countBadgeClass="bg-surface-container text-on-surface-variant"
          columnBgClass="bg-surface-container-low"
          showAddButton={true}
        >
          <TaskCard
            title="Refine color palette for Dark Mode"
            description="Ensure accessibility ratios pass WCAG AA standards for all primary action buttons."
            tag={{ label: 'High Priority', containerClass: 'bg-error-container text-on-error-container' }}
            dueDate="Oct 24"
            assignees={[
              { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU2XC3-7re7aN9y1ZgBwfFuJBU_da5Lew4OVc-PdPHrYHfv7PsFnOhlZTMRLZ6UUCVKlePdP4BuYXKGiKJPRKZJ47v-yrL4hQY1Zx7EFHQRPLUdrQ7744DaDSHw2MhP6YPRUX1PYQwNHVown-QMpmfPCNYurMkMnGXmU6r3MdhfY6RPEMko06WOHxrI9Zvclkh2ax3wJdCEjFVs1OW2gq2JVD_rWCQIIRXNmhaedOJ8q61yqtQNtMtTUle3Lu0G_izrD6EMSS8fiI', name: 'Assignee 1' }
            ]}
          />
          <TaskCard
            title="SEO Audit for Home Page"
            tag={{ label: 'Medium', containerClass: 'bg-secondary-container text-on-secondary-container' }}
            dueDate="Oct 28"
            assignees={[
              { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhUU-k2RS2PhyckeJHsd8js3-Cod4p8faJHDbEAdtvaAyDve6e7IuK-jCXYD1U-T8jXuHANB7zSzsWte7-x5_bw7DHKDtPHXaPjkJcL5Fb4Zz7DxuPiWnG_Kw7ONQfGAHUbdeSbcUOdTqowuri-AVvLBYQhVu4FDl1eqzIsw-9u4CJE5viTIIm9NSgOfi8vHXwqTGJhnuiq_NkgS8uB6eX_HMnlea1GI4ClYUo-xyE5X6hwVm6F5Buy_AcAX165GNxhfodB882npg', name: 'Assignee 2' }
            ]}
          />
        </BoardColumn>

        {/* In Progress Column */}
        <BoardColumn
          title="In Progress"
          count={2}
          countBadgeClass="bg-primary/10 text-primary"
          columnBgClass="bg-surface-container"
        >
          <TaskCard
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDRvfwjRopqUm32y4lqV9a2babO0s45I29lB8ZYToL8jKOhh2xhw6vbPXOslzNNPSQZBwnjBLsAhxQPPgLyeW5dz6iwZRr9NzIbl2ktbL8-LA0J8WedKOSFBso3lJeZVoxl5W7nGpKIkzLdQph1Jf2w_mryR7II66Y4FtI_ClCiGKcScbugctUmrEMyU-WFhfUWt1TkpUPNWeYmmCLI7vSXmU-Rf1HwGc6mMwAAbXANkpxAfj8mKFwI27-Kff_bjfwrADdmlHgTiJo"
            title="Component Library Architecture"
            tag={{ label: 'Development', containerClass: 'bg-tertiary-container text-on-tertiary-container' }}
            progress={{ percentage: 65 }}
            stats={{ comments: 8, attachments: 3 }}
            assignees={[
              { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9AbFPhuoV1LZ248sUh8QIlyljp0-NndZAZtpXZ-2EIHuq-kJa01DHRIYrtPnSgD4KsUUd-zgEGDkge0UOs52baRzfhlD-VgaXWszlM8cNCT3vMiNwQxnUpu-IU1MoJ9BhcxQ6mWJeZK6qSpLBBWIX5mEnJjeCoGICs4SNGbN-KvcsE8YmqeUv_dtiiWWzHES6d-pJDqhWDVBeTPlOvyr0uW5PAeA9jVAQqXZujRq904R7NG_TYTRyul-pAL4NtGwg85yrlTJHfME', name: 'Assignee 1' },
              { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4g7PRKskL9yK5ADyj9cwqxVQ5PJ4xkzmDo0irOgQxZ7iD39ua-RwpT4dS2b_BCYjN5uNqV5smN5xSoQ7ZceXruxsN584Im7LwfsR9Jdx5bTwjUZBT3ViFwpcS3aYpIwshcgw4Syn4SxvoTS-ork6hP_57DYry5z5kN67KZCbCHo0xYmFbdv9gAbNGXq6-u-KluYuY7U5vBIJugn8OWsqasga2Nz0AkratGZbJNyiAxu5zcZXVXSbyJGivfyagYTu6-dkEzqdlkiw', name: 'Assignee 2' }
            ]}
          />
        </BoardColumn>

        {/* In Review Column */}
        <BoardColumn
          title="In Review"
          count={1}
          countBadgeClass="bg-tertiary/10 text-tertiary"
          columnBgClass="bg-surface-container-high"
        >
          <TaskCard
            title="User Interview Summary Report"
            description="Finalizing the data points from 25 customer sessions in Q3."
            tag={{ label: 'High Priority', containerClass: 'bg-error-container text-on-error-container' }}
            isOverdue={true}
            badgeIcon="eye"
            className="border border-outline-variant/15"
            assignees={[
              { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx38MdNKJyE7BtRyoAvv6RySgzb-kVMWOBbFTYUI5ei8TcGptAOZFsTuA021CwSTV1kJvnC4NbRXcnDofzz98z_1P1stOrjT-jDVz3A0RqvLRqA8GjjCCkQVGuLW2ckkHeZudqrLNPs2YjpTgRZNgLT246cqcxfZJHDEeirXfNKROmR3B6lzLArqOfbmu_35pUqqwXO-dlBW7XnCbhlpqXSU-1iaS06tWDnjwa_1x7rdL3xPl1voOHUQ1_LaZJeE3hQT0Q35o4iMM', name: 'Assignee 1' }
            ]}
          />
        </BoardColumn>

        {/* Done Column */}
        <BoardColumn
          title="Done"
          count={12}
          countBadgeClass="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
          columnBgClass="bg-surface-container-high/50"
        >
          <TaskCard
            title="Domain name registration"
            tag={{ label: 'Low', containerClass: 'bg-surface-container text-on-surface-variant' }}
            isCompleted={true}
            completedDate="Oct 12"
            badgeIcon="check"
            className="bg-surface/50 opacity-60 hover:opacity-100 ring-1 ring-outline-variant/10 hover:ring-outline-variant/30 hover:shadow-ambient hover:bg-surface-container transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 group grayscale hover:grayscale-0"
            assignees={[
              { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV72Ou-uw4W7nrJBT9cVF6dc4Z5peZYcTgBOdjKgQsKpADbNABkdUTniFIUSRfGUlvMTqt3zEsi54uMOOl5WFS7jQMD0n6jfGvvoOfxGH5mBQmlEoIfu6Et7Y9zkC0mDcL5p0rqYznxIg1MKkhEVGVQevU7Cs7jiEhhIMHH4Ny2faHhreHKoNrvZP_SF5leqctwrcujT0Ve3gJMoOjkvkSonvxUw6IkNUUWUGOd3zxZg9InDWyKTmSh1xGEpFoFwtJggNpYnlPJ5Y', name: 'Assignee 1' }
            ]}
          />
        </BoardColumn>
      </div>
    </section>
  );
}