export const SpecSection = ({ title, icon: Icon, children, dark = false }: any) => (
    <section className={`${dark ? 'bg-zinc-900 text-white' : 'bg-white border border-black/5'} rounded-[2.5rem] p-8 shadow-sm space-y-6`}>
        <div className={`flex items-center gap-3 font-bold border-b pb-5 ${dark ? 'border-white/10' : 'border-black/5'}`}>
            <Icon size={20} className={dark ? "text-zinc-400" : "text-blue-500"} />
            {title}
        </div>
        <div className="grid gap-5">{children}</div>
    </section>
);