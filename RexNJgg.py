__author__ = 'nobu'

import numpy as np


class RealSolution(object):
    def __init__(self, n):
        self.x = np.empty(n)
        self.f = float('nan')

    def __str__(self):
        return 'x = %s, f(x) = %s' % (str(self.x), str(self.f))


class RexNJgg(object):
    def __init__(self, n, func):
        """

        :param n:
        :param func:
        :return:
        """
        self.n = n
        self.func = func

    def initialize(self, npop, low=-5, high=5):
        """
        初期集団
        :param npop: 集団個体数
        :param low: 下限
        :param high: 上限
        :return:
        """
        self.population = [RealSolution(self.n) for i in range(npop)]
        for s in self.population:
            s.x = np.random.uniform(low, high, self.n)
        self.evaluate(self.population)
        return self.population

    def select_parents(self, npar):
        """
        親選択
        :param npar: 親数
        :return:
        """
        np.random.shuffle(self.population)
        self.parents = self.population[:npar]
        return self.parents

    def make_offspring(self, nchi):
        """
        交叉，子集団生成
        :param nchi: 子個体生成数
        :return:
        """
        mu = len(self.parents)
        m = np.mean(np.array([parent.x for parent in self.parents]), axis=0)
        self.children = [RealSolution(self.n) for i in range(nchi)]
        for child in self.children:
            epsilon = np.random.normal(0., np.sqrt(1 / (mu - 1)), mu)
            child.x = m + np.sum([epsilon[i] * (self.parents[i].x - m) for i in range(mu)], axis=0)
        return self.children

    def survival_selection(self, npar):
        """
        生存選択
        :param npar:
        :return:
        """
        self.evaluate(self.children)
        self.children.sort(key=lambda child: child.f)
        self.population[:npar] = self.children[:npar]
        return self.population

    def evaluate(self, pop):
        """
        集団評価
        :param pop:
        :return:
        """
        for s in pop:
            s.f = self.func(s.x)

    def get_best_evaluation_value(self):
        self.population.sort(key=lambda s: s.f)
        return self.population[0].f, self.population[0].x


if __name__ == '__main__':
    n = 2
    ga = RexNJgg(n, lambda x: np.sum(x**2))

    ga.initialize(14 * n)
    for i in range(10):
        ga.select_parents(n + 1)
        ga.make_offspring(5 * n)
        ga.survival_selection(n + 1)
