import MovieGrid from '@/components/MovieGrid';

const Index = () => {
  return (
    <div className="min-h-screen">
      <header className="p-6 bg-card">
        <h1 className="text-3xl font-bold text-primary">MovieTix</h1>
      </header>
      <main>
        <section className="py-8">
          <h2 className="text-2xl font-semibold px-4 mb-4">Trending Movies</h2>
          <MovieGrid />
        </section>
      </main>
    </div>
  );
};

export default Index;