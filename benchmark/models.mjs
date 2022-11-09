import { DataTypes, Model } from 'sequelize';

export const createModels = (sequelize) => {
	class TestResult extends Model {}
	TestResult.init(
		{
			wordpressPage: DataTypes.STRING,
			nodeName: DataTypes.STRING,
			mutationType: DataTypes.STRING,
			node: DataTypes.STRING,
			nodeOperation: DataTypes.STRING,
			addedNode: DataTypes.STRING,
			addedNodeName: DataTypes.STRING,
			removedNode: DataTypes.STRING,
			removedNodeName: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'testResult',
		}
	);

	class WordPressPage extends Model {}
	WordPressPage.init(
		{
			url: DataTypes.STRING,
			errorOrSuccess: DataTypes.ENUM(
				'success',
				'hydrationError',
				'timeoutError',
				'error'
			),
		},
		{
			sequelize,
			modelName: 'wordpressPage',
		}
	);

	WordPressPage.hasMany(TestResult, { as: 'testResults' });

	return { TestResult, WordPressPage };
};
