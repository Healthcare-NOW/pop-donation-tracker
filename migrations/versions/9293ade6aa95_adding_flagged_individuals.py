"""Adding flagged individuals.

Revision ID: 9293ade6aa95
Revises: 9ed4811a814d
Create Date: 2020-03-04 01:42:27.071216

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9293ade6aa95'
down_revision = '9ed4811a814d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('flagged_individual_contributor',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('city', sa.String(length=30), nullable=True),
    sa.Column('state', sa.String(length=2), nullable=True),
    sa.Column('zip', sa.String(length=9), nullable=True),
    sa.Column('employer', sa.String(length=38), nullable=True),
    sa.Column('occupation', sa.String(length=38), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('individual_contributor', sa.Column('flagged_as_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'individual_contributor', 'flagged_individual_contributor', ['flagged_as_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'individual_contributor', type_='foreignkey')
    op.drop_column('individual_contributor', 'flagged_as_id')
    op.drop_table('flagged_individual_contributor')
    # ### end Alembic commands ###
